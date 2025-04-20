import CommonBodyLayout from "./CommonBodyLayout";
import { Pagination, Stack, Typography } from "@mui/material";
import CourseCard from "../components/CourseCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchCourses, selectAllCourses } from "../store/slices/course.slice";

interface Course {
  id: number;
  name: string;
  duration: string;
  description: string;
  price: string;
  currency: string;
}
const CoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const courses: Course[] = useSelector(selectAllCourses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <CommonBodyLayout>
      <Typography variant="h4" gutterBottom textAlign={"center"} mb={5}>
        Find you exciting courses below
      </Typography>
      <CourseCard courseData={courses} />
      <Stack spacing={2} my={5} alignItems="center">
        <Pagination count={10} variant="outlined" color="primary" />
      </Stack>
    </CommonBodyLayout>
  );
};

export default CoursesPage;
