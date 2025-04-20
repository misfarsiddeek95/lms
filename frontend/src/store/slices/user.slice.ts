// src/store/slices/userSlice.ts
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createAction,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";
import { User } from "../../types";
import { STUDENT_LIST_COUNT } from "../../constants";

export const USER_FEATURE_KEY = "users";

// User type

// State interface
interface UserState {
  users: User[];
  currentUser: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  studentDetail: User | null;
  isModalOpen: boolean;
  isEdit: boolean;
}

// Initial state
const initialState: UserState = {
  users: [],
  currentUser: null,
  status: "idle",
  error: null,
  isLoading: false,
  total: 0,
  page: 0,
  totalPages: 0,
  studentDetail: null,
  isModalOpen: false,
  isEdit: false,
};

const token = localStorage.getItem("token");

// Async Thunks
export const fetchUsers = createAsyncThunk(
  `${USER_FEATURE_KEY}/fetchUsers`,
  async (
    pagination: { page: number; pageSize: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}user/fetch-students`,
        {
          params: {
            page: pagination.page,
            limit: pagination.pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`, // Adding Bearer token to headers
          },
        }
      );
      return {
        users: response.data.data, // assuming your API returns { data: [], meta: {} }
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue("Failed to fetch users");
    }
  }
);

export const createUser = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>(
  `${USER_FEATURE_KEY}/createUser`,
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}user/register`,
        userData
      );
      dispatch(fetchUsers({ page: 1, pageSize: STUDENT_LIST_COUNT }));
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
  }
);

export const updateUser = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>(`${USER_FEATURE_KEY}/updateUser`, async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}user/update-user`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message?.message ||
        error.response?.data?.message ||
        "Update issue";
      return rejectWithValue(message);
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

export const fetchUserById = createAsyncThunk(
  `${USER_FEATURE_KEY}/fetchUserById`,
  async ({ id }: { id: string }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}user/get-user/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  `${USER_FEATURE_KEY}/deleteUser`,
  async ({ id }: { id: string }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}user/delete-user/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

// action
export const openUserModal = createAction(
  `${USER_FEATURE_KEY}/openUserModal`,
  (data: boolean) => {
    return {
      payload: data,
    };
  }
);

export const isEdit = createAction(
  `${USER_FEATURE_KEY}/isEdit`,
  (data: boolean) => {
    return {
      payload: data,
    };
  }
);

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
    openUserModal: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    isEdit: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
      if (!action.payload) {
        state.studentDetail = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log("action", action);
        state.status = "succeeded";
        state.isLoading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.payload as string;
      })
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
      })
      // update
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create user";
      })

      // get single user
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.studentDetail = action.payload;
      })
      .addCase(fetchUserById.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to create user";
      })
      // delete user
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );
      })
      .addCase(deleteUser.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to delete user";
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

export const selectStudentDetail = createSelector(
  getUserState,
  (userState) => userState.studentDetail
);

// Actions
export const { setCurrentUser, resetUserState, setError } = userSlice.actions;

export const selectUserError = (state: RootState) => state.users.error;
export const selectTotalUsers = (state: RootState) => state.users.total;
export const selectTotalPages = (state: RootState) => state.users.totalPages;
export const selectIsModalOpen = (state: RootState) => state.users.isModalOpen;
export const selectIsUserEdit = (state: RootState) => state.users.isEdit;

// Reducer
export default userSlice.reducer;
