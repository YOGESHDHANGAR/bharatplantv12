import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const RowActions = ({
  row,
  table,
  handleDeleteEmployee, // Updated to match the prop name used in GenericReportTable
  deleteEmployeeAsync,
  queryClient,
}) => (
  <Box sx={{ display: "flex", gap: "0rem" }}>
    <Tooltip title="Edit">
      <IconButton sx={{ py: "1" }} onClick={() => table.setEditingRow(row)}>
        <EditIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete">
      <IconButton
        color="error"
        sx={{ py: "1" }}
        onClick={() =>
          handleDeleteEmployee(row, deleteEmployeeAsync, queryClient)
        }
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  </Box>
);
