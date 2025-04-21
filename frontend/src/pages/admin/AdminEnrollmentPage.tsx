import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CommonBodyLayout from "../../components/CommonBodyLayout";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import CommonDataTable from "../../components/CommonDataTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import React, { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import ConfirmationPopup from "../../components/ConformationPopup";
import {
  fetchAllEnrollments,
  getEnrollmentState,
  selectAllEnrollments,
} from "../../store/slices/enrollment.slice";
import EnrollmentFormModal from "../forms/EnrollmentFormModal";

const AdminEnrollmentPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = React.useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  // const [courseId, setCourseId] = useState<number | null>(null);
  // const openModal = useSelector(selectIsCourseModalOpen);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const enrollments = useSelector(selectAllEnrollments);
  const { status, totalPages } = useSelector(getEnrollmentState);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(
      fetchAllEnrollments({
        page: paginationModel.page + 1, // Backend is 1-indexed
        limit: paginationModel.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  const handleEdit = (id: number) => {
    console.log("id", id);
    /* dispatch(fetchCourseById({ id: id.toString() })).then(() => {
      dispatch({
        type: "courses/openCourseModal",
        payload: true,
      });
      dispatch({
        type: "courses/isEdit",
        payload: true,
      });
    }); */
  };

  const handleDelete = (id: number) => {
    console.log("id", id);
    setDeletePopup(true);
    // setCourseId(id);
  };

  const handleClosePopup = () => {
    setDeletePopup(false);
    // setCourseId(null);
  };

  const handleConfirm = async () => {
    /* try {
      if (courseId) {
        dispatch(deleteCourse({ id: courseId.toString() }));
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      handleClosePopup(); // Close the dialog after API call
    } */
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

  /* useEffect(() => {
    setOpen(openModal);
  }, [openModal]); */

  const columns: GridColDef[] = [
    { field: "courseName", headerName: "Course name", width: 130 },
    { field: "studentName", headerName: "Student name", width: 130 },
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
  ];

  return (
    <CommonBodyLayout>
      <Typography variant="h4" gutterBottom>
        Enrollment List
      </Typography>
      <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" size="small" onClick={handleClickOpen}>
          Enroll Student
        </Button>
      </Box>
      <CommonDataTable
        columns={columns}
        rows={enrollments}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        checkboxSelection={false}
        loading={status === "loading"}
        rowCount={totalPages * paginationModel.pageSize}
      />

      {/* Course Modal */}
      <EnrollmentFormModal
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

export default AdminEnrollmentPage;
