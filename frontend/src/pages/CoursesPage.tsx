import CommonBodyLayout from "./CommonBodyLayout";
import { Typography } from "@mui/material";
import CourseCard from "../components/CourseCard";

const CoursesPage = () => {
  return (
    <CommonBodyLayout>
      <Typography variant="h4" gutterBottom textAlign={"center"} mb={5}>
        Find you exciting courses below
      </Typography>
      <CourseCard courseData={[]} />
    </CommonBodyLayout>
  );
};

export default CoursesPage;
