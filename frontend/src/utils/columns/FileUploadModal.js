import React, { useState } from "react";
import { Box, Modal, Typography, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

import "pdfjs-dist/build/pdf.worker.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  p: 4,
  borderRadius: 2,
  outline: "none",
};

const uploadBoxStyle = {
  width: 230,
  height: 320,
  border: "2px dashed #ccc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  marginBottom: "1rem",
  borderRadius: "4px",
  position: "relative",
  overflow: "hidden", // Ensure the image doesn't overflow the box
};

const uploadedImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  position: "absolute",
  top: 0,
  left: 0,
};

const iconOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  opacity: 0,
  transition: "opacity 0.3s",
  zIndex: 1,
};

const FileUploadModal = ({ openModal, setOpenModal, selectedSaleId }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      let fileURL = "";
      if (file.type === "application/pdf") {
        const canvas = await renderPdfPreview(file);
        fileURL = canvas.toDataURL();
      } else if (file.type.startsWith("image/")) {
        fileURL = URL.createObjectURL(file);
      } else {
        console.error("Unsupported file type: ", file.type);
        return;
      }
      setUploadedFiles((prev) => [...prev, { file, url: fileURL }]);
    }
  };

  const renderPdfPreview = async (file) => {
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    const page = await pdf.getPage(1);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const viewport = page.getViewport({ scale: 1 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    return canvas;
  };

  const handleRemoveFile = (index) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this file?"
    );
    if (confirmRemove) {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const handlePreviewFile = (fileURL) => {
    window.open(fileURL, "_blank");
  };

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggingIndex !== null && draggingIndex !== index) {
      const updatedFiles = [...uploadedFiles];
      const [draggedFile] = updatedFiles.splice(draggingIndex, 1);
      updatedFiles.splice(index, 0, draggedFile);
      setUploadedFiles(updatedFiles);
      setDraggingIndex(null);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setUploadedFiles([]); // Reset files on close
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="file-upload-modal-title"
      aria-describedby="file-upload-modal-description"
      BackdropProps={{
        style: { backgroundColor: "transparent" },
      }}
    >
      <Paper sx={style}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          id="file-upload-modal-title"
          variant="h5"
          component="h2"
          sx={{ py: 2 }}
          textAlign="center"
        >
          Upload Documents for Sale ID: {selectedSaleId}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {uploadedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                ...uploadBoxStyle,
                border: "2px solid #000",
                position: "relative",
                overflow: "hidden",
              }}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
            >
              <img
                src={file.url}
                alt={`Uploaded file ${index + 1}`}
                style={uploadedImageStyle}
              />
              <Box
                sx={{
                  ...iconOverlayStyle,
                  "&:hover": { opacity: 1 },
                }}
              >
                <IconButton
                  onClick={() => handlePreviewFile(file.url)}
                  sx={{
                    color: "#fff",
                    position: "absolute",
                    top: 8,
                    left: 8,
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleRemoveFile(index)}
                  sx={{
                    color: "#fff",
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}

          {uploadedFiles.length < 8 && (
            <Box
              sx={{ ...uploadBoxStyle, border: "2px dashed #000" }}
              onClick={() =>
                document.getElementById("file-upload-input").click()
              }
            >
              <AddIcon sx={{ fontSize: 48, color: "#000" }} />
            </Box>
          )}
        </Box>

        <input
          id="file-upload-input"
          type="file"
          accept="application/pdf,image/*"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </Paper>
    </Modal>
  );
};

export default React.memo(FileUploadModal);
