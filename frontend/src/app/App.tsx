import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import PublicLayout from "../layouts/PublicLayout";
import MainLayout from "../layouts/MainLayout";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import CoursesPage from "../pages/CoursesPage";
import AdminCoursesPage from "../pages/admin/AdminCoursesPage";
import EnrollmentsPage from "../pages/EnrollmentsPage";
import LoginPage from "../pages/LoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminStudentsPage from "../pages/admin/AdminStudentsPage";
import HomePage from "../pages/HomePage";
import CourseDetailPage from "../pages/CourseDetailPage";
import theme from "../theme/theme";
import { Provider } from "react-redux";
import { store } from "../store";
import GuestRoute from "../components/GuestRoute";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="course-detail/:id" element={<CourseDetailPage />} />
              <Route
                path="login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="register"
                element={
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                }
              />
            </Route>

            {/* Protected student routes */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/enrollments" element={<EnrollmentsPage />} />
            </Route>

            {/* Protected admin routes */}
            <Route element={<MainLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/students" element={<AdminStudentsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
