import express from "express";
import { getLedgerStatement } from "../controllers/ledgerStatementController.js";
const ledgerStatementRoutes = express.Router();

ledgerStatementRoutes.route("/ledgerStatements").get(getLedgerStatement);

export default ledgerStatementRoutes;
