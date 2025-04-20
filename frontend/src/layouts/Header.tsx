import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Perform logout logic
    navigate("/"); // Redirect to the home page after logout
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ml: "240px",
        width: "calc(100% - 240px)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            Online Learning Platform
          </Link>
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              alt={user?.name}
              src="/static/images/avatar/1.jpg"
              component={Link}
              to={"/dashboard"}
            />
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
