import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import courseReducer from "./slices/course.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          "payload.config",
          "payload.request",
          "error",
          "meta.arg",
        ],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
