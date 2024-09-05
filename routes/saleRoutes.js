import express from "express";
import {
  createSale,
  getAllSales,
  getSingleSale,
  updateSale,
  deleteSale,
  restoreSale,
  permanentDeleteSale,
} from "../controllers/saleController.js";
import { createSalesFromData } from "../controllers/import/createSalesFromData.js";
const saleRoutes = express.Router();

// Route to create a new sale
saleRoutes.route("/sale/new").post(createSale);
saleRoutes.route("/sale/import").get(createSalesFromData);

// Route to get all sales (excluding soft-deleted ones)
saleRoutes.route("/sales").get(getAllSales);

// Route to get a single sale by ID (excluding soft-deleted ones)
saleRoutes.route("/sale/:id").get(getSingleSale);

// Route to update a sale by ID
saleRoutes.route("/sale/:id").put(updateSale);

// Route to soft delete a sale by ID
saleRoutes.route("/sale/:id/delete").delete(deleteSale);

// Route to restore a soft-deleted sale by ID
saleRoutes.route("/sale/:id/restore").put(restoreSale);

// Route to permanently delete a sale by ID
saleRoutes.route("/sale/:id/permanent-delete").delete(permanentDeleteSale);

export default saleRoutes;
