import express from "express";
import {
  createPurchase,
  getAllPurchases,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
  restorePurchase,
  permanentDeletePurchase,
} from "../controllers/purchaseController.js";
import { createPurchasesFromData } from "../controllers/import/createPurchasesFromData.js";
const purchaseRoutes = express.Router();

// Route to create a new purchase
purchaseRoutes.post("/purchase/new", createPurchase);
purchaseRoutes.route("/purchase/import").get(createPurchasesFromData);

// Route to get all purchases (excluding soft-deleted ones)
purchaseRoutes.get("/purchases", getAllPurchases);

// Route to get a single purchase by ID (excluding soft-deleted ones)
purchaseRoutes.get("/purchase/:id", getSinglePurchase);

// Route to update a purchase by ID
purchaseRoutes.put("/purchase/:id", updatePurchase);

// Route to soft delete a purchase by ID
purchaseRoutes.delete("/purchase/:id/delete", deletePurchase);

// Route to restore a soft-deleted purchase by ID
purchaseRoutes.put("/purchase/:id/restore", restorePurchase);

// Route to permanently delete a purchase by ID
purchaseRoutes.delete(
  "/purchase/:id/permanent-delete",
  permanentDeletePurchase
);

export default purchaseRoutes;
