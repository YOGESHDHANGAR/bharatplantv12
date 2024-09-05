import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useUploadFiles } from "../../../api/mutations/fileSystemMutations";
import JSZip from "jszip"; // You'll need to install this library: npm install jszip

const WhatsAppModal = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: uploadFilesAsync } = useUploadFiles();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      try {
        setIsUploading(true);

        const zip = new JSZip();
        const zipContent = await zip.loadAsync(selectedFile);
        const filesToUpload = [];

        // Extract files from the ZIP
        for (const fileName in zipContent.files) {
          if (!zipContent.files[fileName].dir) {
            const fileData = await zipContent.files[fileName].async("blob");
            const file = new File([fileData], fileName);
            filesToUpload.push(file);
          }
        }

        if (filesToUpload.length > 0) {
          await uploadFilesAsync(filesToUpload);
          console.log("Files uploaded successfully");
        }
      } catch (error) {
        console.error("Error uploading files:", error);
      } finally {
        setIsUploading(false);
        onClose();
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Import WhatsApp File
        </Typography>
        <input
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          style={{ marginTop: 16 }}
        />
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
        >
          <Button
            onClick={onClose}
            sx={{ marginRight: 2 }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WhatsAppModal;
