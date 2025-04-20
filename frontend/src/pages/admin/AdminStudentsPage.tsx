import CommonBodyLayout from "../../components/CommonBodyLayout";
import {
  Alert,
  Button,
  CircularProgress,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  selectAllUsers,
  selectIsModalOpen,
  selectTotalPages,
  selectUserError,
  selectUserStatus,
} from "../../store/slices/user.slice";
import { AppDispatch } from "../../store";
import CommonCollapsibleTable from "../../components/CommonCollapsibleTable";
import { STUDENT_LIST_COUNT } from "../../constants";
import { useTheme } from "@mui/material/styles";
import StudentFormModal from "../forms/StudentFormModal";

const AdminStudentsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState(1);
  const [open, setOpen] = React.useState(false);

  const totalPages = useSelector(selectTotalPages);
  const openModal = useSelector(selectIsModalOpen);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const users = useSelector(selectAllUsers);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  useEffect(() => {
    dispatch(
      fetchUsers({
        page, // MUI DataGrid uses 0-based index
        pageSize: STUDENT_LIST_COUNT,
      })
    );
  }, [dispatch, page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); // Update local page state when page changes
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch({
      type: "users/openUserModal",
      payload: false,
    });
    dispatch({
      type: "users/isEdit",
      payload: false,
    });
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  /*  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      resizable: false,
      hideable: true,
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 130,
      resizable: false,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 130,
      resizable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      resizable: false,
    },
    {
      field: "activeStatus",
      headerName: "Active Status",
      width: 120,
      resizable: false,
      renderCell: (params) => (
        <Switch
          checked={params.row.activeStatus}
          onChange={(e) => handleSwitchChange(params.row.id, e.target.checked)}
          color="primary"
        />
      ),
    },
    {
      field: "actions", // must be a unique name not part of the row data
      headerName: "Action",
      width: 300,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      resizable: false,
      renderCell: (params) => {
        if (!params.row || !params.row.id) return null;
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <IconButton
              color="primary"
              onClick={() => handleEdit(params.row.id)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ]; */

  if (status === "loading") {
    return (
      <CommonBodyLayout>
        <CircularProgress />
      </CommonBodyLayout>
    );
  }

  if (error) {
    return (
      <CommonBodyLayout>
        <Alert severity="error">{error}</Alert>
      </CommonBodyLayout>
    );
  }

  return (
    <CommonBodyLayout>
      <Typography variant="h4" gutterBottom>
        Students List
      </Typography>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        size="small"
        sx={{ float: "right", mb: 3 }}
      >
        ADD STUDENT
      </Button>
      <CommonCollapsibleTable students={users} />
      <Stack spacing={2} my={5} alignItems="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
        />
      </Stack>

      {/* Student Modal */}
      <StudentFormModal
        open={open}
        fullscreen={fullScreen}
        handleClose={handleClose}
      />
    </CommonBodyLayout>
  );
};

export default AdminStudentsPage;
