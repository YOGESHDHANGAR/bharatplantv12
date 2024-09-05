import React from "react";
import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { MRT_EditActionButtons } from "material-react-table";

const RenderCreateRowDialogContent = ({
  table,
  row,
  internalEditComponents,
}) => {
  return (
    <>
      <DialogTitle variant="h3">Create New Item</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {internalEditComponents} {/* or render custom edit components here */}
      </DialogContent>
      <DialogActions>
        <MRT_EditActionButtons variant="text" table={table} row={row} />
      </DialogActions>
    </>
  );
};

export default RenderCreateRowDialogContent;
