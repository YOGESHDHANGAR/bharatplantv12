import express from "express";
import {
  createExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
  restoreExpense,
  permanentDeleteExpense,
} from "../controllers/expenseController.js";
import { createExpensesFromData } from "../controllers/import/createExpenseFromData.js";
const expenseRoutes = express.Router();

// Route to create a new expense
expenseRoutes.post("/expense/new", createExpense);
expenseRoutes.get("/expense/import", createExpensesFromData);

// Route to get all expenses (excluding soft-deleted ones)
expenseRoutes.get("/expenses", getAllExpenses);

// Route to get a single expense by ID (excluding soft-deleted ones)
expenseRoutes.get("/expense/:id", getSingleExpense);

// Route to update an expense by ID
expenseRoutes.put("/expense/:id", updateExpense);

// Route to soft delete an expense by ID
expenseRoutes.delete("/expense/:id/delete", deleteExpense);

// Route to restore a soft-deleted expense by ID
expenseRoutes.put("/expense/:id/restore", restoreExpense);

// Route to permanently delete an expense by ID
expenseRoutes.delete("/expense/:id/permanent-delete", permanentDeleteExpense);

export default expenseRoutes;
