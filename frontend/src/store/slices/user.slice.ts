// src/store/slices/userSlice.ts
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";
import { User } from "../../types";

export const USER_FEATURE_KEY = "users";

// User type

// State interface
interface UserState {
  users: User[];
  currentUser: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isLoading: boolean;
}

// Initial state
const initialState: UserState = {
  users: [],
  currentUser: null,
  status: "idle",
  error: null,
  isLoading: false,
};

// Async Thunks
export const createUser = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>(`${USER_FEATURE_KEY}/createUser`, async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}user/register`,
      userData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message?.message ||
        error.response?.data?.message ||
        "Register issue";
      return rejectWithValue(message);
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

// Slice
const userSlice = createSlice({
  name: USER_FEATURE_KEY,
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
    },
    resetUserState(state) {
      state.status = "idle";
      state.error = null;
      state.currentUser = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false; // Stop loading if error occurs
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create user";
      });
  },
});

// Selectors
export const getUserState = (state: RootState): UserState =>
  state[USER_FEATURE_KEY];

export const selectAllUsers = createSelector(
  getUserState,
  (userState) => userState.users
);

export const selectCurrentUser = createSelector(
  getUserState,
  (userState) => userState.currentUser
);

export const selectUserStatus = createSelector(
  getUserState,
  (userState) => userState.status
);

// Actions
export const { setCurrentUser, resetUserState, setError } = userSlice.actions;

export const selectUserError = (state: RootState) => state.users.error;

// Reducer
export default userSlice.reducer;
