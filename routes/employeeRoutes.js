import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
const employeeRoutes = express.Router();

// Route to create a new employee
employeeRoutes.post("/employee/new", createEmployee);

// Route to get all employees
employeeRoutes.get("/employees", getAllEmployees);

// Route to get a single employee by ID
employeeRoutes.get("/employee/:id", getSingleEmployee);

// Route to update an employee by ID
employeeRoutes.put("/employee/:id", updateEmployee);

// Route to delete an employee by ID
employeeRoutes.delete("/employee/:id/delete", deleteEmployee);

export default employeeRoutes;
