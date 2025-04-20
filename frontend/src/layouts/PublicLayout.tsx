import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicHeader from "./PublicHeader";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Ensure full viewport height
        width: "100vw", // Ensure full viewport width
      }}
    >
      <CssBaseline />
      <PublicHeader />
      <Box
        component="main"
        sx={{
          flex: 1, // Takes remaining space
          width: "100%", // Full width
          py: 4, // Padding
          px: 2, // Padding
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
