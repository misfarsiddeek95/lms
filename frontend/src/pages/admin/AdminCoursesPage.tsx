import {
  Box,
  Button,
  debounce,
  IconButton,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CommonBodyLayout from "../../components/CommonBodyLayout";
import { GridPaginationModel } from "@mui/x-data-grid";
// import CommonDataTable from "../../components/CommonDataTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import React, { useEffect, useRef, useState } from "react";
import {
  deleteCourse,
  fetchCourseById,
  fetchCoursesAdmin,
  getCourseState,
  selectAllCourses,
  selectIsCourseModalOpen,
  updatePublishedStatus,
} from "../../store/slices/course.slice";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CourseFormModal from "../forms/CourseFormModal";
import { useTheme } from "@mui/material/styles";
import ConfirmationPopup from "../../components/ConformationPopup";
import { Column, Course } from "../../types";
import CommonTable from "../../components/CommonTable";

const PublishSwitch = React.memo(
  ({
    id,
    checked,
    onToggle,
  }: {
    id: number;
    checked: boolean;
    onToggle: (id: number, value: boolean) => void;
  }) => {
    return <Switch checked={checked} onChange={() => onToggle(id, !checked)} />;
  }
);

const AdminCoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = React.useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(null);
  const openModal = useSelector(selectIsCourseModalOpen);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const courses = useSelector(selectAllCourses);
  const { status, totalPages } = useSelector(getCourseState);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(
      fetchCoursesAdmin({
        page: paginationModel.page + 1, // Backend is 1-indexed
        limit: paginationModel.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  const handleEdit = (id: number) => {
    dispatch(fetchCourseById({ id: id.toString() })).then(() => {
      dispatch({
        type: "courses/openCourseModal",
        payload: true,
      });
      dispatch({
        type: "courses/isEdit",
        payload: true,
      });
    });
  };

  const handleDelete = (id: number) => {
    setDeletePopup(true);
    setCourseId(id);
  };

  const handleClosePopup = () => {
    setDeletePopup(false);
    setCourseId(null);
  };

  const handleConfirm = async () => {
    try {
      if (courseId) {
        dispatch(deleteCourse({ id: courseId.toString() }));
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      handleClosePopup(); // Close the dialog after API call
    }
  };

  const debouncedToggle = useRef(
    debounce((id, isPublished) => {
      dispatch(updatePublishedStatus({ id, isPublished }));
    }, 300)
  ).current;

  const handleSwitch = (id: number, value: boolean) => {
    debouncedToggle(id, value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch({
      type: "courses/openCourseModal",
      payload: false,
    });
    dispatch({
      type: "courses/isEdit",
      payload: false,
    });
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  /* const columns: GridColDef[] = [
    { field: "name", headerName: "Course name", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    {
      field: "duration",
      headerName: "Duration",
      width: 120,
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Course Amount",
      width: 160,
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row as { price: string | number; currency: string };
        const currency = row.currency || "USD";
        const price = parseFloat(row.price as string);

        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
        }).format(price);
      },
    },
    {
      field: "isPublished",
      headerName: "Active Status",
      width: 160,
      headerAlign: "center",
      renderCell: (params) => (
        <PublishSwitch
          id={params.row.id}
          checked={params.row.isPublished}
          onToggle={handleSwitch}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      headerAlign: "right",
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]; */

  const columns: Column<Course>[] = [
    {
      id: "name",
      label: "Course name",
      minWidth: 130,
    },
    {
      id: "description",
      label: "Description",
      minWidth: 130,
    },
    {
      id: "duration",
      label: "Duration",
      minWidth: 120,
      align: "center",
    },
    {
      id: "price",
      label: "Course Amount",
      minWidth: 160,
      align: "center",
      format: (value, row) => {
        const currency = row.currency || "USD";
        const price = parseFloat(value as string);
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
        }).format(price);
      },
    },
    {
      id: "isPublished",
      label: "Active Status",
      minWidth: 160,
      align: "center",
      format: (value, row) => (
        <PublishSwitch
          id={row.id}
          checked={value as boolean}
          onToggle={handleSwitch}
        />
      ),
    },
    {
      id: "id", // assuming 'id' is used for actions
      label: "Action",
      minWidth: 200,
      align: "right",
      format: (value) => (
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <IconButton
            color="primary"
            onClick={() => handleEdit(value as number)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(value as number)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];
  return (
    <CommonBodyLayout>
      <Typography variant="h4" gutterBottom>
        Course List
      </Typography>
      <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" size="small" onClick={handleClickOpen}>
          ADD Course
        </Button>
      </Box>
      {/* <CommonDataTable
        columns={columns}
        rows={courses}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        checkboxSelection={false}
        loading={status === "loading"}
        rowCount={totalPages * paginationModel.pageSize}
      /> */}

      <CommonTable
        columns={columns}
        rows={courses}
        totalCount={totalPages * paginationModel.pageSize}
        page={paginationModel.page}
        rowsPerPage={paginationModel.pageSize}
        onPageChange={(newPage) =>
          setPaginationModel((prev) => ({ ...prev, page: newPage }))
        }
        onRowsPerPageChange={(newRowsPerPage) =>
          setPaginationModel((prev) => ({ ...prev, pageSize: newRowsPerPage }))
        }
        loading={status === "loading"}
      />

      {/* Course Modal */}
      <CourseFormModal
        open={open}
        fullscreen={fullScreen}
        handleClose={handleClose}
      />

      {/* Delete confirmation */}
      <ConfirmationPopup
        title="Are you sure?"
        description="Do you really want to perform this action?"
        open={deletePopup}
        handleClose={handleClosePopup}
        onConfirm={handleConfirm}
      />
    </CommonBodyLayout>
  );
};

export default AdminCoursesPage;
