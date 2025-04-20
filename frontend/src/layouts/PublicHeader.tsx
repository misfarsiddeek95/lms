import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function PublicHeader() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            Online Learning Platform
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
}
