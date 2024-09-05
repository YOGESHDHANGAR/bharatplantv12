import express from "express";

import {
  createLedger,
  deleteLedger,
  getAllLedgers,
  getSingleLedger,
  permanentDeleteLedger,
  restoreLedger,
  updateLedger,
} from "../controllers/ledgerController.js";
import { createLedgersFromData } from "../controllers/import/createLedgersFromData.js";
const ledgerRoutes = express.Router();

// Route to create a new ledger
ledgerRoutes.post("/ledger/new", createLedger);
ledgerRoutes.get("/ledger/import", createLedgersFromData);

// Route to get all ledgers (excluding soft-deleted ones)
ledgerRoutes.get("/ledgers", getAllLedgers);

// Route to get a single ledger by ID (excluding soft-deleted ones)
ledgerRoutes.get("/ledger/:id", getSingleLedger);

// Route to update a ledger by ID
ledgerRoutes.put("/ledger/:id", updateLedger);

// Route to soft delete a ledger by ID
ledgerRoutes.delete("/ledger/:id/delete", deleteLedger);

// Route to restore a soft-deleted ledger by ID
ledgerRoutes.put("/ledger/:id/restore", restoreLedger);

// Route to permanently delete a ledger by ID
ledgerRoutes.delete("/ledger/:id/permanent-delete", permanentDeleteLedger);

export default ledgerRoutes;
