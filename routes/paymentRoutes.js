import express from "express";
import {
  createPayment,
  getAllPayments,
  getSinglePayment,
  updatePayment,
  deletePayment,
  restorePayment,
  permanentDeletePayment,
} from "../controllers/paymentController.js";
import { createPaymentsFromData } from "../controllers/import/createPaymentFromData.js";
const paymentRoutes = express.Router();

// Route to create a new payment
paymentRoutes.post("/payment/new", createPayment);
paymentRoutes.get("/payment/import", createPaymentsFromData);

// Route to get all payments (excluding soft-deleted ones)
paymentRoutes.get("/payments", getAllPayments);

// Route to get a single payment by ID (excluding soft-deleted ones)
paymentRoutes.get("/payment/:id", getSinglePayment);

// Route to update a payment by ID
paymentRoutes.put("/payment/:id", updatePayment);

// Route to soft delete a payment by ID
paymentRoutes.delete("/payment/:id/delete", deletePayment);

// Route to restore a soft-deleted payment by ID
paymentRoutes.put("/payment/:id/restore", restorePayment);

// Route to permanently delete a payment by ID
paymentRoutes.delete("/payment/:id/permanent-delete", permanentDeletePayment);

export default paymentRoutes;
