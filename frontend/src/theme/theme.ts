// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            color: "inherit",
            backgroundColor: "action.hover", // MUI's default hover color
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&:hover": {
            color: "inherit",
            opacity: 0.8,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          "&:hover": {
            color: "inherit",
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

export default theme;
