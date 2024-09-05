import express from "express";
import {
  createSalary,
  getAllSalarys,
  getSingleSalary,
  updateSalary,
  deleteSalary,
  restoreSalary,
  permanentDeleteSalary,
} from "../controllers/salaryController.js";
const salaryRoutes = express.Router();

// Route to create a new salary
salaryRoutes.post("/salary/new", createSalary);

// Route to get all salarys (excluding soft-deleted ones)
salaryRoutes.get("/salarys", getAllSalarys);

// Route to get a single salary by ID (excluding soft-deleted ones)
salaryRoutes.get("/salary/:id", getSingleSalary);

// Route to update an salary by ID
salaryRoutes.put("/salary/:id", updateSalary);

// Route to soft delete an salary by ID
salaryRoutes.delete("/salary/:id/delete", deleteSalary);

// Route to restore a soft-deleted salary by ID
salaryRoutes.put("/salary/:id/restore", restoreSalary);

// Route to permanently delete an salary by ID
salaryRoutes.delete("/salary/:id/permanent-delete", permanentDeleteSalary);

export default salaryRoutes;
