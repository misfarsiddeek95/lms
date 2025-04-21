import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";
import { COURSES_LIST_COUNT } from "../../constants";
import { Course } from "../../types";

export const COURSE_FEATURE_KEY = "courses";

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
  courseDetail: Course | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  status: "idle",
  error: null,
  page: 0,
  totalPages: 0,
  courseDetail: null,
};

const token = localStorage.getItem("token");

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

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async ({ id }: { id: string }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}courses/course-detail/${id}`
    );
    return response.data;
  }
);

export const updatePublishedStatus = createAsyncThunk(
  "courses/updatePublishedStatus",
  async ({ id, isPublished }: { id: number; isPublished: boolean }) => {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}courses/update-published`,
      { id, isPublished },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Adding Bearer token to headers
        },
      }
    );
    return response.data;
  }
);

export const fetchCoursesAdmin = createAsyncThunk<
  CourseResponse,
  { page?: number; limit?: number }
>(
  "courses/fetchCoursesAdmin",
  async ({ page = 1, limit = COURSES_LIST_COUNT }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}courses/fetch-all-courses-admin`,
      { params: { page, limit }, headers: { Authorization: `Bearer ${token}` } }
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
      // Fetch all courses public
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
      })

      // fetch course detail
      .addCase(fetchCourseById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCourseById.fulfilled,
        (state, action: PayloadAction<Course>) => {
          state.status = "succeeded";
          state.courseDetail = action.payload;
        }
      )
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch course detail";
      })

      // update course
      .addCase(updatePublishedStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updatePublishedStatus.fulfilled,
        (state, action: PayloadAction<Course>) => {
          state.status = "succeeded";
          state.courses = state.courses.map((course) =>
            course.id === action.payload.id
              ? { ...course, ...action.payload }
              : course
          );
        }
      )
      .addCase(updatePublishedStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch courses";
      })

      // fetch all course admin
      .addCase(fetchCoursesAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCoursesAdmin.fulfilled,
        (state, action: PayloadAction<CourseResponse>) => {
          state.status = "succeeded";
          state.courses = action.payload.data;
          state.page = action.payload.page;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchCoursesAdmin.rejected, (state, action) => {
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

export const selectCourseDetail = createSelector(
  getCourseState,
  (courseState) => courseState.courseDetail
);

// Actions
export const { clearCurrentCourse, resetCourseStatus } = courseSlice.actions;

export default courseSlice.reducer;
