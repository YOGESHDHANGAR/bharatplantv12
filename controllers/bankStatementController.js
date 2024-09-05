import multer from "multer";
import parseExcel from "../utils/parseExcel.js"; // Import the parseExcel function
import BankStatement from "../models/bankStatementModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";

// These two lines will give you the equivalent of __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

// Route to handle Excel file upload and processing
export const uploadBankStatementFile = [
  upload.single("file"),
  catchAsyncErrors(async (req, res, next) => {
    const filePath = req.file.path;

    try {
      // Parse the Excel file and get the JSON array
      const parsedData = await parseExcel(filePath);

      const totalRecords = parsedData.length;
      let newRecords = 0;
      let duplicateRecords = 0;
      let failedToIdentify = 0;

      // Fetch existing records from the database
      const existingRecords = await BankStatement.find({ isDeleted: false });
      const existingRecordsSet = new Set(
        existingRecords.map((record) => {
          return `${record.date}-${record.narration}-${record.withdrawal}-${record.deposit}-${record.balance}`;
        })
      );

      const seenRecords = new Set();

      parsedData.forEach((record) => {
        const { date, narration, withdrawal, deposit, balance } = record;

        // Validate record format and data
        if (date && narration && (withdrawal || deposit || balance)) {
          const recordKey = `${date}-${narration}-${withdrawal}-${deposit}-${balance}`;

          if (existingRecordsSet.has(recordKey)) {
            duplicateRecords++;
          } else if (seenRecords.has(recordKey)) {
            // Record is a duplicate in the parsed data itself
            duplicateRecords++;
          } else {
            seenRecords.add(recordKey);
            newRecords++; // Increment for valid new records
          }
        } else {
          failedToIdentify++; // Increment for invalid records
        }
      });

      // Send response to the user with the stats
      res.status(200).json({
        success: true,
        uploadBankStatementFileResult: {
          totalRecords,
          newRecords,
          duplicateRecords,
          failedToIdentify,
        },
      });
    } catch (err) {
      console.error("Error processing file:", err);
      return next(new ErrorHandler("Failed to process the file", 500));
    } finally {
      // Clean up: remove the temporary file
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete temporary file:", err);
      });
    }
  }),
];
// Create a new bank statement record
export const createBankStatementRecord = catchAsyncErrors(
  async (req, res, next) => {
    const { date, narration, withdrawal, deposit, balance, company } = req.body;

    // Create the new bank statement record
    const createBankStatementRecordResult = await BankStatement.create({
      date,
      narration,
      withdrawal,
      deposit,
      balance,
      company,
    });

    // Respond with success for new records
    res.status(200).json({
      success: true,
      status: "created",
      createBankStatementRecordResult,
    });
  }
);

/// Get all bank statement records
export const getAllBankStatementRecords = catchAsyncErrors(
  async (req, res, next) => {
    const { dateRange, debouncedGlobalFilter } = req.query;

    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    // Build the query object with date range and soft-deletion filter
    const query = { isDeleted: false };

    // Apply date range filtering if provided
    if (dateRange) {
      const parsedDateRange = JSON.parse(dateRange);
      query.date = {
        $gte: new Date(parsedDateRange.startDate), // Start date
        $lte: new Date(parsedDateRange.endDate), // End date
      };
    }

    // Apply global search filter if provided
    if (debouncedGlobalFilter) {
      const searchRegex = new RegExp(debouncedGlobalFilter, "i");
      const searchNumber = parseFloat(debouncedGlobalFilter);

      query.$or = [
        { accountNumber: searchRegex },
        { transactionType: searchRegex },
        { description: searchRegex },
        ...(isNaN(searchNumber) ? [] : [{ amount: searchNumber }]),
      ];
    }

    // Fetch bank statements with pagination and exclude soft-deleted ones
    const getAllBankStatementRecords = await BankStatement.find(query)
      .skip(skip)
      .limit(limit);

    // Fetch total count for pagination info
    const totalBankStatements = await BankStatement.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "All bank statements retrieved successfully",
      getAllBankStatementRecords,
      totalBankStatements, // Include total count for frontend pagination
      currentPage: page,
      totalPages: Math.ceil(totalBankStatements / limit),
    });
  }
);

// Get a single bank statement record by ID
export const getSingleBankStatementRecord = catchAsyncErrors(
  async (req, res, next) => {
    const getSingleBankStatementRecordResult = await BankStatement.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!getSingleBankStatementRecordResult) {
      return next(new ErrorHandler("Bank statement record not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Single bank statement record",
      getSingleBankStatementRecordResult,
    });
  }
);

// Update a bank statement record by ID
export const updateBankStatementRecord = catchAsyncErrors(
  async (req, res, next) => {
    const bankStatement = await BankStatement.findById(req.params.id);

    if (!bankStatement) {
      return next(new ErrorHandler("Bank statement record not found", 404));
    }

    const updatedBankStatementData = req.body;

    const updatedBankStatementRecordResult =
      await BankStatement.findByIdAndUpdate(
        req.params.id,
        updatedBankStatementData,
        {
          new: true, // Return the modified document instead of the original one
          runValidators: true,
          useFindAndModify: false,
        }
      );

    res.status(200).json({
      success: true,
      message: "Bank statement record updated",
      updatedBankStatementRecordResult,
    });
  }
);

// Soft delete a bank statement record by ID
export const deleteBankStatementRecord = catchAsyncErrors(
  async (req, res, next) => {
    const bankStatement = await BankStatement.findById(req.params.id);

    if (!bankStatement) {
      return next(new ErrorHandler("Bank statement record not found", 404));
    }

    bankStatement.isDeleted = true;
    await bankStatement.save();

    res.status(200).json({
      success: true,
      message: "Bank statement record has been moved to recycle bin",
    });
  }
);

// Restore a soft-deleted bank statement record by ID
export const restoreBankStatementRecord = catchAsyncErrors(
  async (req, res, next) => {
    const bankStatement = await BankStatement.findById(req.params.id);

    if (!bankStatement) {
      return next(new ErrorHandler("Bank statement record not found", 404));
    }

    bankStatement.isDeleted = false;
    await bankStatement.save();

    res.status(200).json({
      success: true,
      message: "Bank statement record has been restored",
    });
  }
);

// Permanently delete a bank statement record by ID
export const permanentDeleteBankStatementRecord = catchAsyncErrors(
  async (req, res, next) => {
    const bankStatement = await BankStatement.findById(req.params.id);

    if (!bankStatement) {
      return next(new ErrorHandler("Bank statement record not found", 404));
    }

    await bankStatement.remove();

    res.status(200).json({
      success: true,
      message: "Bank statement record has been permanently deleted",
    });
  }
);
