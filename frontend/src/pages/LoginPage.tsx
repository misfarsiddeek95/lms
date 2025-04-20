import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Fade,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  login,
  selectAuthError,
  selectAuthLoading,
} from "../store/slices/auth.slice";
import { AppDispatch } from "../store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        navigate("/dashboard"); // Adjust the route as per your app's structure
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        p: 3,
      }}
    >
      <Fade in timeout={500}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Login to Your Account
        </Typography>
      </Fade>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            "& .MuiInputLabel-root": { color: "primary.main" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
            mb: 2,
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{
            "& .MuiInputLabel-root": { color: "primary.main" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
            mb: 2,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  sx={{ color: "primary.main" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {error && (
          <Typography color="error" sx={{ mb: 2, fontWeight: 500 }}>
            {error}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{
              padding: "12px 20px",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default LoginPage;
