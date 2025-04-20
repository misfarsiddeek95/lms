import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

// Define user type based on your Prisma schema
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "STUDENT";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Try to get auth state from localStorage (for persistent login)
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        return JSON.parse(storedAuth);
      } catch (error) {
        console.error("Failed to parse stored auth state", error);
      }
    }
  }
  return {
    user: null,
    token: null,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.error = null;

      // Persist to localStorage
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoading = false;

      // Clear from localStorage
      localStorage.removeItem("auth");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Action creators
export const { setCredentials, setLoading, setError, logout, clearError } =
  authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectIsAdmin = (state: RootState) =>
  state.auth.user?.role === "ADMIN";
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
