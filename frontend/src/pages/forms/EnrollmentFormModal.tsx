import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import useDebounce from "../../hooks/useDebounce";
import {
  searchStudents,
  selectSearchedStudents,
} from "../../store/slices/user.slice";
import {
  searchCourses,
  selectSearchedCourses,
} from "../../store/slices/course.slice";
import {
  createEnrollment,
  selectedEnrollment,
  selectIsEnrollmentEdit,
} from "../../store/slices/enrollment.slice";

interface EnrollmentFormProps {
  open: boolean;
  handleClose: () => void;
  fullscreen: boolean;
}

interface EnrollmentFormData {
  userId: number;
  courseIds: number[];
}

// Dummy data (replace with API or Redux data)

const validationSchema = Yup.object().shape({
  userId: Yup.number().required("Student is required"),
  courseIds: Yup.array()
    .of(Yup.number().required())
    .min(1, "At least one course must be selected"),
});

const EnrollmentFormModal = ({ open, handleClose }: EnrollmentFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEdit = useSelector(selectIsEnrollmentEdit);
  const searchedUsers = useSelector(selectSearchedStudents);
  const searchedCourses = useSelector(selectSearchedCourses);
  const currentEnrollment = useSelector(selectedEnrollment);

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );

  const [searchStudentTerm, setSearchStudentTerm] = useState("");
  const [searchCoursetTerm, setSearchCoursetTerm] = useState("");

  // Debounce the search input
  const debounseUserSearch = useDebounce(searchStudentTerm, 500);
  const debounseCourseSearch = useDebounce(searchCoursetTerm, 500);

  useEffect(() => {
    if (debounseUserSearch.trim().length > 0) {
      dispatch(searchStudents({ search: debounseUserSearch }));
    }
    if (debounseCourseSearch.trim().length > 0) {
      dispatch(
        searchCourses({
          search: debounseCourseSearch,
          userId: selectedStudentId?.toString() ?? "",
        })
      );
    }
  }, [debounseUserSearch, debounseCourseSearch, selectedStudentId, dispatch]);

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnrollmentFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      userId: undefined,
      courseIds: [],
    },
  });

  useEffect(() => {
    if (isEdit && currentEnrollment) {
      // Edit mode: prefill the form
      reset({
        userId: currentEnrollment?.userId,
        courseIds: currentEnrollment?.courseIds,
      });
    } else {
      // Add mode: reset to default empty values
      reset({
        userId: undefined,
        courseIds: [],
      });
    }
  }, [isEdit, currentEnrollment, reset]);

  const onSubmit = async (data: EnrollmentFormData) => {
    try {
      await dispatch(createEnrollment(data)).unwrap(); // Use your actual dispatch
      handleClose();
    } catch (err) {
      const errorMessage =
        typeof err === "string" ? err : "Something went wrong";
      setError("userId", { type: "manual", message: errorMessage });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Enroll Student</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={searchedUsers || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => {
                  field.onChange(value?.id ?? null);
                  setSelectedStudentId(value?.id ?? null);
                }}
                value={
                  searchedUsers?.find(
                    (user) => user.id === selectedStudentId
                  ) ?? null
                }
                onInputChange={(_, value, reason) => {
                  if (reason === "input") {
                    // Only update on user input
                    setSearchStudentTerm(value);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Student"
                    margin="normal"
                    fullWidth
                    error={!!errors.userId}
                    helperText={errors.userId?.message}
                  />
                )}
              />
            )}
          />

          <Controller
            name="courseIds"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={searchedCourses}
                getOptionLabel={(option) => option.name}
                onChange={(_, values) =>
                  field.onChange(values.map((v) => v.id))
                }
                onInputChange={(_, value, reason) => {
                  if (reason === "input") {
                    // Only update on user input
                    setSearchCoursetTerm(value);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Courses"
                    margin="normal"
                    fullWidth
                    error={!!errors.courseIds}
                    helperText={errors.courseIds?.message}
                  />
                )}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ my: 3, py: 1.5 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "ENROLL STUDENT"
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

export default EnrollmentFormModal;
