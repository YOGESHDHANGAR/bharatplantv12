import express from "express";
import { createDatabaseExport } from "../controllers/exportController.js";
const exportRoutes = express.Router();

exportRoutes.get("/export/database", createDatabaseExport);

export default exportRoutes;
