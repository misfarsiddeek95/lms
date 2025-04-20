import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

interface Course {
  courseId: string | number;
  title: string;
  desc: string;
}
interface CardProps {
  courseData: Course[];
}

export default function CourseCard({ courseData }: CardProps) {
  return (
    <Grid container spacing={2}>
      {courseData &&
        courseData.map((course) => (
          <Grid size={{ xs: 3, md: 6 }} key={course.courseId}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {course.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {course.desc}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
