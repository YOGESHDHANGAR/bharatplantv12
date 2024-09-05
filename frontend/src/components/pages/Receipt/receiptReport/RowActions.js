import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileUploadModal from "../../../../utils/columns/FileUploadModal";

export const RowActions = ({
  row,
  handleEditClick,
  handleDeleteReceipt,
  deleteReceiptAsync,
  queryClient,
}) => {
  const [isFileAttachModal, setIsFileAttachModal] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);

  const handleAttachFileClick = () => {
    setSelectedReceiptId(row.original._id);
    setIsFileAttachModal(true);
  };

  return (
    <Box sx={{ display: "flex", gap: "0.5rem" }}>
      <Tooltip title="Edit">
        <IconButton onClick={() => handleEditClick(row)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          color="error"
          onClick={() =>
            handleDeleteReceipt(row, deleteReceiptAsync, queryClient)
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
        selectedReceiptId={selectedReceiptId}
      />
    </Box>
  );
};

export default React.memo(RowActions);
