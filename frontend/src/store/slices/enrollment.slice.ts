import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import { createEnrollmentObj, Enrollment } from "../../types";
import axios from "axios";
import { ENROLLMENT_LIST_COUNT } from "../../constants";

export const ENROLLMENT_FEATURE_KEY = "enrollments";

interface EnrollmentResponse {
  data: Enrollment[];
  page: number;
  totalPages: number;
}

interface EnrollmentState {
  enrollments: Enrollment[];
  currentEnrollment: Enrollment | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  totalPages: number;
  enrollmentDetail: Enrollment | null;
  isModalOpen: boolean;
  isEdit: boolean;
}

const initialState: EnrollmentState = {
  enrollments: [],
  currentEnrollment: null,
  status: "idle",
  error: null,
  page: 0,
  totalPages: 0,
  enrollmentDetail: null,
  isModalOpen: false,
  isEdit: false,
};

const token = localStorage.getItem("token");

// Async Thunks

export const fetchAllEnrollments = createAsyncThunk<
  EnrollmentResponse,
  { page?: number; limit?: number }
>(
  `${ENROLLMENT_FEATURE_KEY}/fetchAllEnrollments`,
  async ({ page = 1, limit = ENROLLMENT_FEATURE_KEY }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}enrollment/list-all-enrollments`,
      { params: { page, limit }, headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

export const createEnrollment = createAsyncThunk<
  createEnrollmentObj,
  Partial<createEnrollmentObj>,
  { rejectValue: string }
>(
  `${ENROLLMENT_FEATURE_KEY}/createEnrollment`,
  async (enrollData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}enrollment/create-enrollment`,
        enrollData
      );
      dispatch(fetchAllEnrollments({ page: 1, limit: ENROLLMENT_LIST_COUNT }));
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

const enrollmentSlice = createSlice({
  name: ENROLLMENT_FEATURE_KEY,
  initialState,
  reducers: {
    clearCurrentEnrollment(state) {
      state.currentEnrollment = null;
    },
    resetEnrollmentStatus(state) {
      state.status = "idle";
      state.error = null;
    },
    openEnrollmentModal: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    isEdit: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
      if (!action.payload) {
        state.enrollmentDetail = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEnrollments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllEnrollments.fulfilled,
        (state, action: PayloadAction<EnrollmentResponse>) => {
          state.status = "succeeded";
          state.enrollments = action.payload.data;
          state.page = action.payload.page;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchAllEnrollments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch enrollments";
      })
      // Create
      .addCase(createEnrollment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createEnrollment.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.enrollments.push(action.payload);
        console.log("action", action);
      })
      .addCase(createEnrollment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create user";
      });
  },
});

// Selectors
export const getEnrollmentState = (rootState: RootState): EnrollmentState =>
  rootState[ENROLLMENT_FEATURE_KEY];

export const selectAllEnrollments = createSelector(
  getEnrollmentState,
  (enrollmentState) => enrollmentState.enrollments
);

export const selectEnrollmentDetail = createSelector(
  getEnrollmentState,
  (enrollmentState) => enrollmentState.enrollmentDetail
);

// Actions
export const { clearCurrentEnrollment, resetEnrollmentStatus } =
  enrollmentSlice.actions;

export default enrollmentSlice.reducer;
