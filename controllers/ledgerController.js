import Ledger from "../models/ledgerModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Create a new ledger
export const createLedger = catchAsyncErrors(async (req, res, next) => {
  const { ledgerName, ledgerType, company } = req.body;

  const createLedgerResult = await Ledger.create({
    ledgerName,
    ledgerType,
    company: "66c8cf8d044dd7b4537a594e",
  });

  res.status(201).json({
    success: true,
    message: "Ledger created successfully",
    createLedgerResult,
  });
});

// Get all ledgers (excluding soft-deleted ones)
export const getAllLedgers = catchAsyncErrors(async (req, res, next) => {
  const { debouncedGlobalFilter } = req.query;

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  // Base query to exclude soft-deleted ledgers
  const query = { isDeleted: false };

  // Apply global search filter if provided
  if (debouncedGlobalFilter) {
    const searchRegex = new RegExp(debouncedGlobalFilter, "i");
    const searchNumber = parseFloat(debouncedGlobalFilter);

    query.$or = [{ ledgerName: searchRegex }, { ledgerType: searchRegex }];
  }

  // Fetch ledgers with pagination
  const getAllLedgersResult = await Ledger.find(query).skip(skip).limit(limit);

  // Calculate the total count of matching ledgers
  const totalLedgers = await Ledger.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All ledgers retrieved successfully",
    getAllLedgersResult,
    totalLedgers, // Include total count for frontend pagination
    currentPage: page,
    totalPages: Math.ceil(totalLedgers / limit),
  });
});

// Get a single ledger by ID (excluding soft-deleted ones)
export const getSingleLedger = catchAsyncErrors(async (req, res, next) => {
  const getSingleLedgerResult = await Ledger.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!getSingleLedgerResult) {
    return next(new ErrorHandler("Ledger not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Retrieved single ledger",
    getSingleLedgerResult,
  });
});

// Update a ledger by ID
export const updateLedger = catchAsyncErrors(async (req, res, next) => {
  const ledger = await Ledger.findById(req.params.id);

  if (!ledger || ledger.isDeleted) {
    return next(new ErrorHandler("Ledger not found", 404));
  }

  const updatedLedgerData = req.body;

  const updatedLedgerResult = await Ledger.findByIdAndUpdate(
    req.params.id,
    updatedLedgerData,
    {
      new: true, // Return the modified document instead of the original one
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Ledger updated successfully",
    updatedLedgerResult,
  });
});

// Soft delete a ledger by ID
export const deleteLedger = catchAsyncErrors(async (req, res, next) => {
  const ledger = await Ledger.findById(req.params.id);

  if (!ledger || ledger.isDeleted) {
    return next(new ErrorHandler("Ledger not found", 404));
  }

  ledger.isDeleted = true;
  await ledger.save();

  res.status(200).json({
    success: true,
    message: "Ledger has been moved to recycle bin",
  });
});

// Restore a soft-deleted ledger by ID
export const restoreLedger = catchAsyncErrors(async (req, res, next) => {
  const ledger = await Ledger.findById(req.params.id);

  if (!ledger || !ledger.isDeleted) {
    return next(new ErrorHandler("Ledger not found or not deleted", 404));
  }

  ledger.isDeleted = false;
  await ledger.save();

  res.status(200).json({
    success: true,
    message: "Ledger has been restored",
  });
});

// Permanently delete a ledger by ID
export const permanentDeleteLedger = catchAsyncErrors(
  async (req, res, next) => {
    const ledger = await Ledger.findById(req.params.id);

    if (!ledger) {
      return next(new ErrorHandler("Ledger not found", 404));
    }

    await ledger.remove(); // Permanently remove the ledger

    res.status(200).json({
      success: true,
      message: "Ledger has been permanently deleted",
    });
  }
);
