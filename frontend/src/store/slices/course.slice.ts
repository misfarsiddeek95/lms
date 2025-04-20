import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";
import { COURSES_LIST_COUNT } from "../../constants";

export const COURSE_FEATURE_KEY = "courses";

interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: string;
  currency: string;
}

interface CourseResponse {
  data: Course[];
  page: number;
  totalPages: number;
}

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  totalPages: number;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  status: "idle",
  error: null,
  page: 0,
  totalPages: 0,
};

// Async Thunks
export const fetchCourses = createAsyncThunk<
  CourseResponse,
  { page?: number; limit?: number; search?: string }
>(
  "courses/fetchCourses",
  async ({ page = 1, limit = COURSES_LIST_COUNT, search = "" }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}courses/fetch-all-courses`,
      { params: { page, limit, search } }
    );
    return response.data;
  }
);

const courseSlice = createSlice({
  name: COURSE_FEATURE_KEY,
  initialState,
  reducers: {
    clearCurrentCourse(state) {
      state.currentCourse = null;
    },
    resetCourseStatus(state) {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCourses.fulfilled,
        (state, action: PayloadAction<CourseResponse>) => {
          state.status = "succeeded";
          state.courses = action.payload.data;
          state.page = action.payload.page;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch courses";
      });
  },
});

// Selectors
// export const getCourseState = (state: RootState) => state.courses;

export const getCourseState = (rootState: RootState): CourseState =>
  rootState[COURSE_FEATURE_KEY];

export const selectAllCourses = createSelector(
  getCourseState,
  (courseState) => courseState.courses
);

// Actions
export const { clearCurrentCourse, resetCourseStatus } = courseSlice.actions;

export default courseSlice.reducer;
