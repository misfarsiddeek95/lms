import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            Online Learning Platform
          </Link>
        </Typography>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar alt={user.firstName} src="/static/images/avatar/1.jpg" />
            <Button color="inherit" onClick={logout}>
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
