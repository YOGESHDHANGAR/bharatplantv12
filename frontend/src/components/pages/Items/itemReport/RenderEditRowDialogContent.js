import React from "react";
import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { MRT_EditActionButtons } from "material-react-table";

const RenderEditRowDialogContent = ({ table, row, internalEditComponents }) => {
  return (
    <>
      <DialogTitle variant="h3">Update Item</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {internalEditComponents} {/* or render custom edit components here */}
      </DialogContent>
      <DialogActions>
        <MRT_EditActionButtons variant="text" table={table} row={row} />
      </DialogActions>
    </>
  );
};

export default RenderEditRowDialogContent;
