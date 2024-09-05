import React from "react";
import { Modal, Box, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PurchaseEdit from "./PurchaseEdit";

const PurchaseEditModel = ({ isOpen, onClose, selectedPurchase }) => {
  const handleModelCloseOnSubmit = () => {
    onClose(); // Close the modal
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="edit-purchase-modal"
      aria-describedby="edit-purchase-modal-description"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        sx={{
          height: "97vh",
          padding: 4,
          margin: "10px 180px",
          backgroundColor: "white",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        <Tooltip title="Close">
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "gray",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
        <Box display="flex" justifyContent="center" width="100%">
          <PurchaseEdit
            selectedPurchase={selectedPurchase}
            handleModelCloseOnSubmit={handleModelCloseOnSubmit}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default PurchaseEditModel;
