import express from "express";
import {
  getAllDeletedParticulars,
  permanentDeleteParticular,
  restoreParticular,
} from "../controllers/recycleBinController.js";
const recycleBinRoutes = express.Router();

// Route to get all soft-deleted items from all modules
recycleBinRoutes.get("/recycleBin/item/allDeleted", getAllDeletedParticulars);
recycleBinRoutes.delete(
  "/recycleBin/item/permanentDelete/:type/:id",
  permanentDeleteParticular
);
recycleBinRoutes.put("/recycleBin/item/restore/:type/:id", restoreParticular);

export default recycleBinRoutes;
