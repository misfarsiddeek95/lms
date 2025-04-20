import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout() {
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      <CssBaseline />
      {user && <Sidebar />} {/* This should have fixed width, eg. 240px */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <Box component="main" sx={{ flex: 1, py: 3, px: 2 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
