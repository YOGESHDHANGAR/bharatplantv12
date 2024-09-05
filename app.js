import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import companyRoutes from "./routes/companyRoutes.js";
import ledgerRoutes from "./routes/ledgerRoutes.js";
import ledgerStatementRoutes from "./routes/ledgerStatementRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import fileSystemRoutes from "./routes/fileSystemRoutes.js";
import fileManagerRoutes from "./routes/fileMangerRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import recycleBinRoutes from "./routes/recycleBinRoutes.js";
import bankStatementRoutes from "./routes/bankStatementRoutes.js";
import importRoutes from "./routes/importRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
import errorMiddleware from "./middlewares/error.js";

const app = express();

// These two lines will give you the equivalent of __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "utils/uploads")));

// Config
if (process.env.NODE_ENV === "PRODUCTION") {
  import("dotenv").then(({ config }) =>
    config({ path: "backend/config/config.env" })
  );
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Health Check Route
app.get("/api/v1/health", (req, res) => {
  res.status(200).send("Server is running");
});

// Route Imports
app.use("/api/v1", companyRoutes);
app.use("/api/v1", ledgerRoutes);
app.use("/api/v1", ledgerStatementRoutes);
app.use("/api/v1", expenseRoutes);
app.use("/api/v1", itemRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", purchaseRoutes);
app.use("/api/v1", receiptRoutes);
app.use("/api/v1", saleRoutes);
app.use("/api/v1", fileSystemRoutes);
app.use("/api/v1", fileManagerRoutes);
app.use("/api/v1", employeeRoutes);
app.use("/api/v1", recycleBinRoutes);
app.use("/api/v1", bankStatementRoutes);
app.use("/api/v1", salaryRoutes);
app.use("/api/v1", importRoutes);
app.use("/api/v1", exportRoutes);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middleware for Errors
app.use(errorMiddleware);

export default app;
