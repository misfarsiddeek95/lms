import {
  Box,
  Button,
  debounce,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import CommonBodyLayout from "../../components/CommonBodyLayout";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import CommonDataTable from "../../components/CommonDataTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchCoursesAdmin,
  getCourseState,
  selectAllCourses,
  updatePublishedStatus,
} from "../../store/slices/course.slice";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    console.log("Edit clicked", id);
    // your edit logic id
  };

  const handleDelete = (id: number) => {
    console.log("Delete clicked", id);
    // your delete logic here
  };

  const debouncedToggle = useRef(
    debounce((id, isPublished) => {
      dispatch(updatePublishedStatus({ id, isPublished }));
      console.log("id", id);
      console.log("isPublished", isPublished);
    }, 300)
  ).current;

  const handleSwitch = (id: number, value: boolean) => {
    debouncedToggle(id, value);
  };

  const columns: GridColDef[] = [
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
  ];

  return (
    <CommonBodyLayout>
      <Typography variant="h4" gutterBottom>
        Course List
      </Typography>
      <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" size="small">
          ADD Course
        </Button>
      </Box>
      <CommonDataTable
        columns={columns}
        rows={courses}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        checkboxSelection={false}
        loading={status === "loading"}
        rowCount={totalPages * paginationModel.pageSize}
      />
    </CommonBodyLayout>
  );
};

export default AdminCoursesPage;
