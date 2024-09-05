import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PaymentEdit from "../PaymentEdit";

const CustomRenderEditRowDialogContent = ({ open, onClose, row }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false} // Disable the default maxWidth behavior
      sx={{
        "& .MuiDialog-paper": {
          width: "90vw", // 90% of the viewport width
          height: "100vh", // 90% of the viewport height
          maxWidth: "none", // Prevent any additional max-width constraints
          maxHeight: "none", // Prevent any additional max-height constraints
        },
      }}
    >
      <DialogTitle
        variant="h4"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Update Ledger
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          flex: 1, // Allows the content to grow within the dialog
        }}
      >
        <PaymentEdit selectedPayment={row.original} />
      </DialogContent>
    </Dialog>
  );
};

export default CustomRenderEditRowDialogContent;
