import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const drawerWidth = 240;

export default function MainLayout() {
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <CssBaseline />

      {/* Sidebar */}
      {user && (
        <Box
          component="nav"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
          }}
        >
          <Sidebar />
        </Box>
      )}

      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          // ml: user ? `${drawerWidth}px` : 0,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Header />

        {/* This pushes the content below the AppBar if it's fixed */}
        {/* <Toolbar /> */}

        <Box component="main" sx={{ flex: 1, py: 3, px: 2 }}>
          <Outlet />
        </Box>

        <Footer />
      </Box>
    </Box>
  );
}
