import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
  createUser,
  selectIsUserEdit,
  selectStudentDetail,
  selectUserError,
  updateUser,
} from "../../store/slices/user.slice";
import * as Yup from "yup";
import { RegisterFormDataModal } from "../../types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface StudentFormProps {
  open: boolean;
  fullscreen: boolean;
  handleClose: () => void;
}

const StudentFormModal = ({
  open,
  fullscreen,
  handleClose,
}: StudentFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector(selectUserError);
  const selectedStudent = useSelector(selectStudentDetail);

  const isEdit = useSelector(selectIsUserEdit);

  const createValidationSchema = (isEdit: boolean) => {
    const baseSchema = Yup.object().shape({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
    });

    if (isEdit) {
      return baseSchema;
    }

    return baseSchema.concat(
      Yup.object().shape({
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("Confirm Password is required"),
      })
    );
  };

  const validationSchema = createValidationSchema(isEdit);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<RegisterFormDataModal>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (selectedStudent) {
      reset({
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
        email: selectedStudent.email,
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
      });
    }
  }, [selectedStudent, reset]);

  const onSubmit = async (data: RegisterFormDataModal) => {
    try {
      await dispatch(
        isEdit
          ? updateUser({ ...data, id: selectedStudent?.id })
          : createUser({ ...data, role: "STUDENT", isActive: true })
      ).unwrap();

      if (handleClose) {
        handleClose(); // This will close the modal
      }
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
    <Dialog
      fullScreen={fullscreen}
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      aria-labelledby="responsive-dialog-title"
      disableEscapeKeyDown
    >
      <DialogTitle id="responsive-dialog-title">
        {"Register Student"}
      </DialogTitle>
      <DialogContent>
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
          {!isEdit && (
            <>
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
            </>
          )}

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="small"
            sx={{
              my: 3,
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
              "SUBMIT"
            )}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleClose}
            size="small"
          >
            CLOSE
          </Button>
        </form>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default StudentFormModal;
