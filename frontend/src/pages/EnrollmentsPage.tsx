import CommonBodyLayout from "../components/CommonBodyLayout";
import { Typography } from "@mui/material";
import { Course } from "../types";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyCourses,
  loadingStatus,
  selectMyCourses,
} from "../store/slices/course.slice";
import { useEffect } from "react";
import { AppDispatch } from "../store";
import { useAuth } from "../hooks/useAuth";
import CourseCard from "../components/CourseCard";

const EnrollmentsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  const courses: Course[] = useSelector(selectMyCourses);
  const loading = useSelector(loadingStatus);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyCourses({ id: user?.id.toString() }));
    }
  }, [user, dispatch]);
  return (
    <CommonBodyLayout>
      <Typography variant="h4" gutterBottom textAlign={"center"} mb={5}>
        Find you enrolled courses below
      </Typography>
      {loading === "succeeded" && (
        <CourseCard
          courseData={courses}
          showLearnMore={false}
          showDuration={true}
        />
      )}
    </CommonBodyLayout>
  );
};

export default EnrollmentsPage;
