import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createAction,
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

type SearchedCourse = {
  id: number;
  name: string;
};

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  totalPages: number;
  courseDetail: Course | null;
  isModalOpen: boolean;
  isEdit: boolean;
  searchedCourses: SearchedCourse[];
  myCourses: Course[];
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  status: "idle",
  error: null,
  page: 0,
  totalPages: 0,
  courseDetail: null,
  isModalOpen: false,
  isEdit: false,
  searchedCourses: [],
  myCourses: [],
};

const token = localStorage.getItem("token");

// Async Thunks

export const createOrUpdateCourse = createAsyncThunk<
  Course,
  Partial<Course>,
  { rejectValue: string }
>(
  "courses/createOrUpdateCourse",
  async (courseData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}courses/create-or-update-course`,
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adding Bearer token to headers
          },
        }
      );
      dispatch(fetchCoursesAdmin({ page: 1, limit: COURSES_LIST_COUNT }));
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

export const deleteCourse = createAsyncThunk(
  `courses/deleteCourse`,
  async ({ id }: { id: string }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}courses/delete-course/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

export const searchCourses = createAsyncThunk(
  `courses/searchCourses`,
  async (
    { search, userId }: { search: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}courses/search-courses`,
        {
          params: { search: search, userId: userId }, // Explicitly structure params
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return {
        courses: response.data, // Your API returns the array directly
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const fetchMyCourses = createAsyncThunk(
  "courses/fetchMyCourses",
  async ({ id }: { id: string }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}courses/my-courses/${id}`,
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
export const openCourseModal = createAction(
  `courses/openCourseModal`,
  (data: boolean) => {
    return {
      payload: data,
    };
  }
);

export const isEdit = createAction(`courses/isEdit`, (data: boolean) => {
  return {
    payload: data,
  };
});

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
    openCourseModal: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    isEdit: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
      if (!action.payload) {
        state.courseDetail = null;
      }
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
      })
      // delete course
      .addCase(deleteCourse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courses = state.courses.filter(
          (coourse) => coourse.id !== action.payload.id
        );
      })
      .addCase(deleteCourse.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to delete user";
      })
      // search courses
      .addCase(searchCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchedCourses = action.payload.courses;
      })
      .addCase(searchCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // my courses
      .addCase(fetchMyCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myCourses = action.payload;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
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

export const selectCourseError = (state: RootState) => state.courses.error;
export const selectIsCourseModalOpen = (state: RootState) =>
  state.courses.isModalOpen;
export const selectIsCouserEdit = (state: RootState) => state.courses.isEdit;

export const selectSearchedCourses = (state: RootState) =>
  state.courses.searchedCourses;

export const selectMyCourses = (state: RootState) => state.courses.myCourses;
export const loadingStatus = (state: RootState) => state.courses.status;

export default courseSlice.reducer;
