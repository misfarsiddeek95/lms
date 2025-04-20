import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { createUser, selectUserError } from "../store/slices/user.slice";
import { useNavigate } from "react-router";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector(selectUserError);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(
        createUser({ ...data, role: "STUDENT", isActive: true })
      ).unwrap();
      navigate("/login");
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Something went wrong";
      if (
        errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("username")
      ) {
        setError("email", {
          type: "manual",
          message: errorMessage,
        });
      } else {
        setError("confirmPassword", {
          type: "manual",
          message: errorMessage,
        });
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 450,
          width: "100%",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
          Register
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 3, color: "#666" }}
        >
          Create your student account below
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#125ea7" },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
