import express from "express";
import {
  createItem,
  getAllItems,
  getSingleItem,
  updateItem,
  deleteItem,
  restoreItem,
  permanentDeleteItem,
} from "../controllers/itemController.js";
import { createItemsFromData } from "../controllers/import/createItemsFromData.js";
const itemRoutes = express.Router();

// Route to create a new item
itemRoutes.post("/item/new", createItem);
itemRoutes.get("/item/import", createItemsFromData);

// Route to get all items (excluding soft-deleted ones)
itemRoutes.get("/items", getAllItems);

// Route to get a single item by ID (excluding soft-deleted ones)
itemRoutes.get("/item/:id", getSingleItem);

// Route to update an item by ID
itemRoutes.put("/item/:id", updateItem);

// Route to soft delete an item by ID
itemRoutes.delete("/item/:id/delete", deleteItem);

// Route to restore a soft-deleted item by ID
itemRoutes.put("/item/:id/restore", restoreItem);

// Route to permanently delete an item by ID
itemRoutes.delete("/item/:id/permanent-delete", permanentDeleteItem);

export default itemRoutes;
