import express from "express";
import {
  deleteFile,
  uploadFiles,
  downloadFile,
  listFiles,
} from "../controllers/fileManagerController.js";
const fileManagerRoutes = express.Router();

// Route to upload new files
fileManagerRoutes.post("/files", uploadFiles);

// Route to list all files
fileManagerRoutes.get("/files", listFiles);

// Route to download a specific file by its name
fileManagerRoutes.get("/files/:fileName", downloadFile);

// Route to delete a specific file by its name
fileManagerRoutes.delete("/files/:fileName", deleteFile);

export default fileManagerRoutes;
