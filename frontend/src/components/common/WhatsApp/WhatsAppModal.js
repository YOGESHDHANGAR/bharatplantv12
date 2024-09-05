import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useUploadFiles } from "../../../api/mutations/fileSystemMutations";
import JSZip from "jszip"; // Ensure JSZip is installed

const WhatsAppModal = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: uploadFilesAsync } = useUploadFiles();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".zip")) {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid .zip file");
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(selectedFile);
      const filesToUpload = [];

      // Extract each file and prepare for upload
      for (const [relativePath, file] of Object.entries(zipContent.files)) {
        if (!file.dir) {
          const fileData = await file.async("blob");

          // Extract file extension from the relativePath
          const fileExtension = relativePath.split(".").pop();

          // Determine the MIME type based on the file extension
          const mimeType =
            {
              jpg: "image/jpeg",
              jpeg: "image/jpeg",
              png: "image/png",
              gif: "image/gif",
              bmp: "image/bmp",
              tiff: "image/tiff",
              pdf: "application/pdf",
              doc: "application/msword",
              docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              xls: "application/vnd.ms-excel",
              xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              ppt: "application/vnd.ms-powerpoint",
              pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              txt: "text/plain",
              html: "text/html",
              csv: "text/csv",
              zip: "application/zip",
              rar: "application/x-rar-compressed",
              mp3: "audio/mpeg",
              wav: "audio/wav",
              mp4: "video/mp4",
              mkv: "video/x-matroska",
              avi: "video/x-msvideo",
              mov: "video/quicktime",
              json: "application/json",
              xml: "application/xml",
              svg: "image/svg+xml",
              ico: "image/x-icon",
              psd: "image/vnd.adobe.photoshop",
              ai: "application/postscript",
              eps: "application/postscript",
              indd: "application/x-indesign",
              xd: "application/vnd.adobe.xd",
              sketch: "application/x-sketch",
            }[fileExtension] || "application/octet-stream";

          const extractedFile = new File([fileData], relativePath, {
            type: mimeType,
          });
          filesToUpload.push(extractedFile);
        }
      }

      // Create a FormData object to hold the extracted files
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append("files", file);
      });

      // Upload the extracted files
      const response = await uploadFilesAsync(formData);
      console.log("Upload response:", response);

      // Handle success
      alert("Files uploaded successfully!");
      onClose();
    } catch (error) {
      console.error("Error processing the zip file:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
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
