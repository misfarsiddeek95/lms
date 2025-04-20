import React from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

interface CommonDataTableProps<T> {
  columns: GridColDef[];
  rows: T[];
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  checkboxSelection?: boolean;
  loading?: boolean;
  rowCount: number;
}

const CommonDataTable = <T extends { id: string | number }>({
  columns,
  rows,
  paginationModel,
  onPaginationModelChange,
  checkboxSelection = false,
  loading = false,
  rowCount,
}: CommonDataTableProps<T>) => {
  return (
    <Paper sx={{ height: 370, width: "100%" }}>
      <DataGrid
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            whiteSpace: "normal",
            lineHeight: "1.5rem",
            textAlign: "center", // Add this line to center the text
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5", // Optional: header background
          },
          "& .MuiDataGrid-columnHeader": {
            justifyContent: "center", // Center the container of the header content
          },
          "& .MuiDataGrid-cell": {
            textAlign: "center", // Center cell data
          },
        }}
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 25]}
        paginationMode="server"
        rowCount={rowCount}
        checkboxSelection={checkboxSelection}
        loading={loading}
        disableColumnMenu
      />
    </Paper>
  );
};

export default CommonDataTable;
