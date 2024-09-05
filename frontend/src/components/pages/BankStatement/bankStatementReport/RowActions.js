import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const RowActions = ({ row, onEditClick, openDeleteConfirmModal }) => (
  <Box sx={{ display: "flex", gap: "0rem" }}>
    <Tooltip title="Edit">
      <IconButton sx={{ py: "1" }} onClick={() => onEditClick(row)}>
        <EditIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete">
      <IconButton
        color="error"
        sx={{ py: "1" }}
        onClick={() => openDeleteConfirmModal(row)}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  </Box>
);
