import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadModal from "../../../../utils/columns/FileUploadModal";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export const RowActions = ({
  row,
  handleEditClick,
  handleDeletePurchase, // Updated to match the prop name used in GenericReportTable
  deletePurchaseAsync,
  queryClient,
}) => {
  const [isFileAttachModal, setIsFileAttachModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  const handleAttachFileClick = () => {
    setSelectedSaleId(row.original._id);
    setIsFileAttachModal(true);
  };

  return (
    <Box sx={{ display: "flex", gap: "0rem" }}>
      <Tooltip title="Edit">
        <IconButton onClick={() => handleEditClick(row)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          color="error"
          onClick={() =>
            handleDeletePurchase(row, deletePurchaseAsync, queryClient)
          }
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Attach Files">
        <IconButton color="primary" onClick={handleAttachFileClick}>
          <AttachFileIcon />
        </IconButton>
      </Tooltip>
      <FileUploadModal
        isFileAttachModal={isFileAttachModal}
        setIsFileAttachModal={setIsFileAttachModal}
        selectedSaleId={selectedSaleId}
      />
    </Box>
  );
};
