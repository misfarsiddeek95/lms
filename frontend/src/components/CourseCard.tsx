import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useNavigate } from "react-router";
import { Course } from "../types";

interface CardProps {
  courseData: Course[];
  showLearnMore?: boolean;
  showDuration?: boolean;
}

export default function CourseCard({
  courseData,
  showLearnMore = true,
  showDuration = false,
}: CardProps) {
  const navigate = useNavigate();
  return (
    <Grid container spacing={5}>
      {courseData &&
        courseData.map((course) => (
          <Grid size={{ xs: 3, md: 3 }} key={course.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                sx={{
                  height: 140,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#1a237e",
                }}
              >
                <AutoStoriesIcon sx={{ fontSize: 60, color: "white" }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  textAlign={"center"}
                >
                  {course.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 200,
                  }}
                >
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                {showLearnMore && (
                  <Button
                    size="small"
                    onClick={() => navigate(`/course-detail/${course.id}`)}
                  >
                    Learn More
                  </Button>
                )}
                {showDuration && (
                  <Button size="small">{course.duration}</Button>
                )}

                <Button size="small" sx={{ marginLeft: "auto" }}>
                  {course.currency}
                  {course.price}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
