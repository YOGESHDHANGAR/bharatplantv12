import Receipt from "../models/receiptModel.js";
import moment from "moment";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Create a new receipt
export const createReceipt = catchAsyncErrors(async (req, res, next) => {
  const {
    vchNo,
    date,
    ref,
    day,
    modes,
    narration,
    voucherTotal,
    company,
    ledger,
  } = req.body;

  // Basic validation (can be extended)
  if (!vchNo || !date || !modes || !voucherTotal || !company || !ledger) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing",
    });
  }

  // Parse and format the date
  const formattedDate = moment(
    date,
    ["DD-MM-YYYY", "YYYY-MM-DD"],
    true
  ).toDate();

  if (isNaN(formattedDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  const createReceiptResult = await Receipt.create({
    vchNo,
    date: formattedDate,
    ref,
    day,
    partyName: ledger.label,
    modes,
    narration,
    voucherTotal,
    company,
    ledger: ledger.value,
  });

  res.status(201).json({
    success: true,
    message: "Receipt created successfully",
    createReceiptResult,
  });
});

// Get all receipts (excluding soft-deleted ones) with pagination, date filtering, and search functionality
export const getAllReceipts = catchAsyncErrors(async (req, res, next) => {
  const { dateRange, debouncedGlobalFilter } = req.query;

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  // Build the query object
  const query = { isDeleted: false };

  // If dateRange is provided, add it to the query
  if (dateRange) {
    const parsedDateRange = JSON.parse(dateRange);
    query.date = {
      $gte: new Date(parsedDateRange.startDate), // Start date
      $lte: new Date(parsedDateRange.endDate), // End date
    };
  }

  // If debouncedGlobalFilter is provided, add search conditions to the query
  if (debouncedGlobalFilter) {
    const searchRegex = new RegExp(debouncedGlobalFilter, "i");
    const searchNumber = parseFloat(debouncedGlobalFilter);

    query.$or = [
      { vchNo: searchRegex },
      { ref: searchRegex },
      { day: searchRegex },
      { partyName: searchRegex },
      { narration: searchRegex },
      ...(isNaN(searchNumber) ? [] : [{ voucherTotal: searchNumber }]),
    ];
  }

  // Fetch receipts with pagination and exclude soft-deleted ones
  const getAllReceiptsResultWithoutPopulated = await Receipt.find(query)
    .skip(skip)
    .limit(limit);

  // Populate the necessary fields
  const getAllReceiptsResult = await Receipt.populate(
    getAllReceiptsResultWithoutPopulated,
    [{ path: "ledger" }, { path: "company" }]
  );

  // Calculate the total sum of receiptTotal across all records matching the query
  const vouchersTotalSum = await Receipt.aggregate([
    { $match: query },
    { $group: { _id: null, totalVoucher: { $sum: "$voucherTotal" } } },
  ]);

  // Fetch total count for pagination info
  const totalReceipts = await Receipt.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All receipts retrieved successfully",
    getAllReceiptsResult,
    totalReceipts, // Include total count for frontend pagination
    currentPage: page,
    totalPages: Math.ceil(totalReceipts / limit),
    vouchersTotalSum: vouchersTotalSum[0]?.totalVoucher || 0, // Handle cases with no matching documents
  });
});

// Get a single receipt by ID (excluding soft-deleted ones)
export const getSingleReceipt = catchAsyncErrors(async (req, res, next) => {
  const getSingleReceiptResultWithoutPopulated = await Receipt.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!getSingleReceiptResultWithoutPopulated) {
    return next(new ErrorHandler("Receipt not found or is deleted", 404));
  }

  const getSingleReceiptResult = await Receipt.populate(
    getSingleReceiptResultWithoutPopulated,
    [{ path: "receiptToCustomer" }, { path: "receiptItems" }]
  );

  res.status(200).json({
    success: true,
    message: "Single receipt retrieved successfully",
    getSingleReceiptResult,
  });
});

// Update a receipt by ID
export const updateReceipt = catchAsyncErrors(async (req, res, next) => {
  const receipt = await Receipt.findById(req.params.id);

  if (!receipt || receipt.isDeleted) {
    return next(new ErrorHandler("Receipt not found or is deleted", 404));
  }

  const { vchNo, date, ref, day, partyName, modes, narration, voucherTotal } =
    req.body;

  // Parse and format the date
  const formattedDate = moment(
    date,
    ["DD-MM-YYYY", "YYYY-MM-DD"],
    true
  ).toDate();

  if (isNaN(formattedDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  const updateReceiptData = {
    vchNo,
    date: formattedDate,
    ref,
    day,
    partyName: partyName.value,
    modes,
    narration,
    voucherTotal,
  };

  const updatedReceipt = await Receipt.findByIdAndUpdate(
    req.params.id,
    updateReceiptData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  const updatedReceiptResult = await Receipt.populate(updatedReceipt, [
    { path: "receiptToCustomer" },
    { path: "receiptItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Receipt updated successfully",
    updatedReceiptResult,
  });
});

// Soft delete a receipt by ID
export const deleteReceipt = catchAsyncErrors(async (req, res, next) => {
  const receipt = await Receipt.findById(req.params.id);

  if (!receipt || receipt.isDeleted) {
    return next(new ErrorHandler("Receipt not found or already deleted", 404));
  }

  receipt.isDeleted = true;
  await receipt.save();

  const deletedReceiptResult = await Receipt.populate(receipt, [
    { path: "receiptToCustomer" },
    { path: "receiptItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Receipt has been moved to recycle bin",
    deletedReceiptResult,
  });
});

// Restore a soft-deleted receipt by ID
export const restoreReceipt = catchAsyncErrors(async (req, res, next) => {
  const receipt = await Receipt.findById(req.params.id);

  if (!receipt || !receipt.isDeleted) {
    return next(new ErrorHandler("Receipt not found or not deleted", 404));
  }

  receipt.isDeleted = false;
  await receipt.save();

  const restoredReceiptResult = await Receipt.populate(receipt, [
    { path: "receiptToCustomer" },
    { path: "receiptItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Receipt has been restored",
    restoredReceiptResult,
  });
});

// Permanently delete a receipt by ID
export const permanentDeleteReceipt = catchAsyncErrors(
  async (req, res, next) => {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return next(new ErrorHandler("Receipt not found", 404));
    }

    await receipt.remove(); // Permanently remove the receipt

    res.status(200).json({
      success: true,
      message: "Receipt has been permanently deleted",
    });
  }
);
