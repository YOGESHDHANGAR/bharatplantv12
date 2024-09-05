import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";

export const RowActions = ({
  row,
  table,
  handleRestoreItemOfRecycleBin,
  restoreRecycleBinItemAsync,
  handlePermanentlyRecycleBinItem,
  permanentltyDeleteRecycleBinItemAsync,
  queryClient,
}) => {
  console.log("RowActions render", { row }); // Check if props are correct

  return (
    <Box sx={{ display: "flex", gap: "0rem" }}>
      <Tooltip title="Restore">
        <IconButton
          sx={{ py: "1" }}
          onClick={() =>
            handleRestoreItemOfRecycleBin(
              row,
              restoreRecycleBinItemAsync,
              queryClient
            )
          }
        >
          <RestoreRoundedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          color="error"
          sx={{ py: "1" }}
          onClick={() =>
            handlePermanentlyRecycleBinItem(
              row,
              permanentltyDeleteRecycleBinItemAsync,
              queryClient
            )
          }
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
