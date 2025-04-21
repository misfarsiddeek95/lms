import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
  createOrUpdateCourse,
  selectCourseDetail,
  selectCourseError,
  selectIsCouserEdit,
} from "../../store/slices/course.slice";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

interface CourseFormProps {
  open: boolean;
  fullscreen: boolean;
  handleClose: () => void;
}

interface CourseFormData {
  name: string;
  description: string;
  duration: string;
  price: string;
  currency: string;
}

const currencies = ["USD", "EUR", "LKR", "GBP", "INR"];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Course name is required"),
  description: Yup.string().required("Description is required"),
  duration: Yup.string().required("Duration is required"),
  price: Yup.string()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price must be positive"),
  currency: Yup.string().required("Currency is required").min(2).max(3),
});

const CourseFormModal = ({
  open,
  fullscreen,
  handleClose,
}: CourseFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedCourse = useSelector(selectCourseDetail);
  const isEdit = useSelector(selectIsCouserEdit);
  const error = useSelector(selectCourseError);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      price: "",
      currency: "USD",
    },
  });

  useEffect(() => {
    if (isEdit && selectedCourse) {
      // Edit mode: prefill the form
      reset({
        name: selectedCourse.name,
        description: selectedCourse.description,
        duration: selectedCourse.duration,
        price: selectedCourse.price,
        currency: selectedCourse.currency,
      });
    } else {
      // Add mode: reset to default empty values
      reset({
        name: "",
        description: "",
        duration: "",
        price: "",
        currency: "USD",
      });
    }
  }, [isEdit, selectedCourse, reset]);

  const onSubmit = async (data: CourseFormData) => {
    try {
      await dispatch(
        isEdit
          ? createOrUpdateCourse({ ...data, id: selectedCourse?.id })
          : createOrUpdateCourse({ ...data, isPublished: true })
      ).unwrap();

      handleClose();
    } catch (err) {
      const errorMessage =
        typeof err === "string" ? err : "Something went wrong";
      setError("name", {
        type: "manual",
        message: errorMessage,
      });
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
      disableEscapeKeyDown
    >
      <DialogTitle>{isEdit ? "Update Course" : "Create Course"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Course Name"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            label="Duration"
            fullWidth
            margin="normal"
            {...register("duration")}
            error={!!errors.duration}
            helperText={errors.duration?.message}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ step: "0.01" }}
            {...register("price")}
            error={!!errors.price}
            helperText={errors.price?.message}
          />

          <FormControl fullWidth margin="normal" error={!!errors.currency}>
            <InputLabel id="currency-label">Currency</InputLabel>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select labelId="currency-label" label="Currency" {...field}>
                  {currencies.map((cur) => (
                    <MenuItem key={cur} value={cur}>
                      {cur}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Typography variant="caption" color="error">
              {errors.currency?.message}
            </Typography>
          </FormControl>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ my: 3, py: 1.5 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEdit ? (
              "UPDATE COURSE"
            ) : (
              "CREATE COURSE"
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleClose}
          >
            CLOSE
          </Button>
        </form>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default CourseFormModal;
