import express from "express";
import {
  createCompany,
  getAllCompanys,
  getSingleCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
const companyRoutes = express.Router();

// Route to create a new company
companyRoutes.post("/company/new", createCompany);

// Route to get all companies
companyRoutes.get("/companys", getAllCompanys);

// Route to get a single company by ID
companyRoutes.get("/company/:id", getSingleCompany);

// Route to update a company by ID
companyRoutes.put("/company/:id", updateCompany);

// Route to delete a company by ID
companyRoutes.delete("/company/:id/delete", deleteCompany);

export default companyRoutes;
