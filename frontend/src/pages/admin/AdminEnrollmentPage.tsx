import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CommonBodyLayout from "../../components/CommonBodyLayout";
import { GridPaginationModel } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import React, { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import ConfirmationPopup from "../../components/ConformationPopup";
import {
  deleteEnrollment,
  fetchAllEnrollments,
  getEnrollment,
  getEnrollmentState,
  selectAllEnrollments,
  selectIsEnrollmentModalOpen,
} from "../../store/slices/enrollment.slice";
import EnrollmentFormModal from "../forms/EnrollmentFormModal";
import { Column, Enrollment } from "../../types";
import CommonTable from "../../components/CommonTable";

const AdminEnrollmentPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = React.useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [enrollId, setEnrollId] = useState<number | null>(null);

  const openModal = useSelector(selectIsEnrollmentModalOpen);

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

  /* const handleEdit = (id: number) => {
    console.log("id", id);
    dispatch(getEnrollment({ userId: id.toString() })).then(() => {
      dispatch({
        type: "enrollments/openEnrollmentModal",
        payload: true,
      });
      dispatch({
        type: "enrollments/isEdit",
        payload: true,
      });
    });
  }; */

  const handleDelete = (id: number) => {
    console.log("id", id);
    setDeletePopup(true);
    setEnrollId(id);
  };

  const handleClosePopup = () => {
    setDeletePopup(false);
    setEnrollId(null);
  };

  const handleConfirm = async () => {
    try {
      if (enrollId) {
        dispatch(deleteEnrollment({ id: enrollId.toString() }));
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      handleClosePopup(); // Close the dialog after API call
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch({
      type: "enrollments/openEnrollmentModal",
      payload: false,
    });
    dispatch({
      type: "enrollments/isEdit",
      payload: false,
    });
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  /* const columns: GridColDef[] = [
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
      width: 150,
      headerAlign: "right",
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row.userId)}
          >
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]; */

  const columns: Column<Enrollment>[] = [
    {
      id: "courseName",
      label: "Course name",
      minWidth: 130,
    },
    {
      id: "studentName",
      label: "Student name",
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
    },
    {
      id: "id", // or userId depending on your logic
      label: "Action",
      minWidth: 200,
      align: "right",
      format: (value, row) => (
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <IconButton color="primary">
            {/* onClick={() => handleEdit(row.id)} */}
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row.id)}>
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
      {/* <CommonDataTable
        columns={columns}
        rows={enrollments}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        checkboxSelection={false}
        loading={status === "loading"}
        rowCount={totalPages * paginationModel.pageSize}
      /> */}

      <CommonTable
        columns={columns}
        rows={enrollments}
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
