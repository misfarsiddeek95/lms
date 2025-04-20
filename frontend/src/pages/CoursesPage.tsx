import CommonBodyLayout from "./CommonBodyLayout";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import CourseCard from "../components/CourseCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchCourses, selectAllCourses } from "../store/slices/course.slice";
import LinearWithValueLabel from "../components/LinearWithValueLabel";
import SearchIcon from "@mui/icons-material/Search";
import useDebounce from "../hooks/useDebounce";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search input
  const debouncedSearch = useDebounce(searchTerm, 500);

  const courses: Course[] = useSelector(selectAllCourses);
  const totalPages = useSelector(
    (state: RootState) => state.courses.totalPages
  );
  const loadingStatus = useSelector((state: RootState) => state.courses.status);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); // Update local page state when page changes
  };

  useEffect(() => {
    dispatch(fetchCourses({ search: debouncedSearch, page, limit: 6 }));
  }, [debouncedSearch, page, dispatch]);

  return (
    <CommonBodyLayout>
      <Typography variant="h4" gutterBottom textAlign={"center"} mb={5}>
        Find you exciting courses below
      </Typography>

      <FormControl sx={{ my: 4 }} variant="outlined" fullWidth size="small">
        <InputLabel htmlFor="outlined-adornment-search">
          Search Course
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-search"
          type={"text"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          label="Search Course"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // reset to page 1 on new search
          }}
        />
      </FormControl>

      {loadingStatus === "loading" && <LinearWithValueLabel />}

      {loadingStatus === "succeeded" && (
        <>
          <CourseCard courseData={courses} />
          <Stack spacing={2} my={5} alignItems="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              color="primary"
            />
          </Stack>
        </>
      )}
    </CommonBodyLayout>
  );
};

export default CoursesPage;
