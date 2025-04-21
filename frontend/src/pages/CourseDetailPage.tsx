import React, { useEffect } from "react";
import CommonBodyLayout from "../components/CommonBodyLayout";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import {
  fetchCourseById,
  selectCourseDetail,
} from "../store/slices/course.slice";
import { useNavigate, useParams } from "react-router";
import { Course } from "../types";

import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useAuth } from "../hooks/useAuth";
import { createEnrollment } from "../store/slices/enrollment.slice";

const CourseDetailPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  const course: Course | null = useSelector(selectCourseDetail);
  const { user } = useAuth();

  console.log("course", course);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById({ id }));
    }
  }, [dispatch, id]);

  const handleEnroll = () => {
    if (!user) {
      navigate("/login"); // Not logged in → redirect to login
      return;
    }

    if (id !== undefined) {
      dispatch(
        createEnrollment({ userId: user.id, courseIds: [parseInt(id)] })
      );
      navigate("/enrollments");
      return;
    }

    // TODO: Implement actual enrollment logic here
    console.log("Enrolling in course ID:", id);
  };

  return (
    <CommonBodyLayout>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Card>
            <CardActionArea>
              <CardMedia
                sx={{
                  height: 250,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ea80fc",
                }}
              >
                <AutoStoriesIcon sx={{ fontSize: 60, color: "white" }} />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h4" component="div">
                  {course?.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                  mb={4}
                >
                  {course?.description}
                </Typography>
                <Divider />
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    my: 3,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    DURATION: {course?.duration}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    PRICE: {course?.currency} {course?.price}
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                fullWidth
                sx={{ fontWeight: 700, my: 2 }}
                onClick={handleEnroll}
              >
                Enroll
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </CommonBodyLayout>
  );
};

export default CourseDetailPage;
