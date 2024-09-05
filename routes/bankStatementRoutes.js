import express from "express";
import {
  createBankStatementRecord,
  getAllBankStatementRecords,
  getSingleBankStatementRecord,
  updateBankStatementRecord,
  deleteBankStatementRecord,
  uploadBankStatementFile,
} from "../controllers/bankStatementController.js";

const bankStatementRoutes = express.Router();

bankStatementRoutes.post("/bankStatement/uploadFile", uploadBankStatementFile);

// Route to create a new bankStatement
bankStatementRoutes.post("/bankStatement/newRecord", createBankStatementRecord);

// Route to get all bankStatements
bankStatementRoutes.get(
  "/bankStatement/allRecords",
  getAllBankStatementRecords
);

// Route to get a single bankStatement by ID
bankStatementRoutes.get("/bankStatement/:id", getSingleBankStatementRecord);

// Route to update an bankStatement by ID
bankStatementRoutes.put("/bankStatement/:id/update", updateBankStatementRecord);

// Route to delete an bankStatement by ID
bankStatementRoutes.delete(
  "/bankStatement/:id/delete",
  deleteBankStatementRecord
);

export default bankStatementRoutes;
