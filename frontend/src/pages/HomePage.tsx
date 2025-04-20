import { Box, Typography, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { LightbulbOutlined, SchoolOutlined } from "@mui/icons-material";
import CommonBodyLayout from "../components/CommonBodyLayout";
const HomePage = () => {
  const theme = useTheme();
  return (
    <CommonBodyLayout>
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 800,
          mx: "auto",
          px: { xs: 2, md: 0 },
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 3,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
          }}
        >
          Welcome to LearnHub
        </Typography>

        <Typography
          variant="h5"
          component="p"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Your gateway to <strong>interactive learning</strong> and{" "}
          <strong>skill mastery</strong>. Discover courses tailored to your
          ambitions.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            startIcon={<LightbulbOutlined />}
            sx={{ px: 4 }}
          >
            Start Learning
          </Button>

          <Button
            component={Link}
            to="/courses"
            variant="outlined"
            size="large"
            startIcon={<SchoolOutlined />}
            sx={{ px: 4 }}
          >
            Browse Courses
          </Button>
        </Box>

        <Box
          sx={{
            mt: 10,
            p: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.grey[50],
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Why Choose LearnHub?
          </Typography>
          <Typography color="text.secondary">
            • 500+ expert-led courses • Personalized learning paths •
            Interactive projects • Certificate upon completion • 24/7 access
            from any device
          </Typography>
        </Box>
      </Box>
    </CommonBodyLayout>
  );
};

export default HomePage;
