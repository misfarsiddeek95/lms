import { Box, Typography, Link as MuiLink } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "background.paper" }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {"© "}
        <MuiLink color="inherit" href="/">
          Online Learning Platform
        </MuiLink>{" "}
        {new Date().getFullYear()}
        {". Built by "}
        <MuiLink color="inherit" href="#">
          Misfar Siddeek
        </MuiLink>
        {"."}
      </Typography>
    </Box>
  );
}
