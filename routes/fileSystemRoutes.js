import express from "express";
import {
  deleteFile,
  uploadFiles,
  getAllFiles,
} from "../controllers/fileSystemController.js";
const fileSystemRoutes = express.Router();

// Route to upload new files
fileSystemRoutes.post("/files/upload", uploadFiles);

// Route to get the list of all uploaded files
fileSystemRoutes.get("/files", getAllFiles);

// Route to delete a specific file by its ID (or name, as appropriate)
fileSystemRoutes.delete("/file/:id/delete", deleteFile);

export default fileSystemRoutes;
