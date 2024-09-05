import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"; // Import the new icon
import DeleteIcon from "@mui/icons-material/Delete";

export const RowActions = ({
  row,
  onViewClick,
  handlePermanentlyDeleteFiles,
  deleteFileSystemAsync,
  queryClient,
}) => (
  <Box sx={{ display: "flex", gap: "0.5rem" }}>
    <Tooltip title="View">
      <IconButton sx={{ py: "1" }} onClick={() => onViewClick(row)}>
        <RemoveRedEyeIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete">
      <IconButton
        color="error"
        sx={{ py: "1" }}
        onClick={() =>
          handlePermanentlyDeleteFiles(row, deleteFileSystemAsync, queryClient)
        }
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  </Box>
);
