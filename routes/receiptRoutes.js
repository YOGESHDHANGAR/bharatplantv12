import express from "express";
import {
  createReceipt,
  getAllReceipts,
  getSingleReceipt,
  updateReceipt,
  deleteReceipt,
  restoreReceipt,
  permanentDeleteReceipt,
} from "../controllers/receiptController.js";
import { createReceiptsFromData } from "../controllers/import/createReceiptFromData.js";
const receiptRoutes = express.Router();

// Route to create a new receipt
receiptRoutes.post("/receipt/new", createReceipt);
receiptRoutes.get("/receipt/import", createReceiptsFromData);

// Route to get all receipts (excluding soft-deleted ones)
receiptRoutes.get("/receipts", getAllReceipts);

// Route to get a single receipt by ID (excluding soft-deleted ones)
receiptRoutes.get("/receipt/:id", getSingleReceipt);

// Route to update a receipt by ID
receiptRoutes.put("/receipt/:id", updateReceipt);

// Route to soft delete a receipt by ID
receiptRoutes.delete("/receipt/:id/delete", deleteReceipt);

// Route to restore a soft-deleted receipt by ID
receiptRoutes.put("/receipt/:id/restore", restoreReceipt);

// Route to permanently delete a receipt by ID
receiptRoutes.delete("/receipt/:id/permanent-delete", permanentDeleteReceipt);

export default receiptRoutes;
