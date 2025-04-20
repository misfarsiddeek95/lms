import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";

export const COURSE_FEATURE_KEY = "courses";

interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: string;
  currency: string;
}

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  status: "idle",
  error: null,
};

// Async Thunks
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}courses/fetch-all-courses`
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
        (state, action: PayloadAction<Course[]>) => {
          state.status = "succeeded";
          state.courses = action.payload;
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
