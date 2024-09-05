import Purchase from "../models/purchaseModel.js";
import moment from "moment";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Create a new purchase
export const createPurchase = catchAsyncErrors(async (req, res, next) => {
  const {
    vchNo,
    date,
    ref,
    day,
    items,
    narration,
    voucherTotal,
    company,
    ledger,
  } = req.body;

  // Basic validation (can be extended)
  if (!vchNo || !date || !items || !voucherTotal || !company || !ledger) {
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

  const createPurchaseResult = await Purchase.create({
    vchNo,
    date: formattedDate,
    ref,
    day,
    partyName: ledger.label,
    items,
    narration,
    voucherTotal,
    company,
    ledger: ledger.value,
  });

  res.status(201).json({
    success: true,
    message: "Purchase created successfully",
    createPurchaseResult,
  });
});

export const getAllPurchases = catchAsyncErrors(async (req, res, next) => {
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
      { purchaseNo: searchRegex },
      { ref: searchRegex },
      { day: searchRegex },
      { partyName: searchRegex },
      { "items.itemName": searchRegex },
      { narration: searchRegex },
      ...(isNaN(searchNumber) ? [] : [{ voucherTotal: searchNumber }]),
    ];
  }

  // Fetch purchases with pagination and exclude soft-deleted ones
  const getAllPurchaseResultWithoutPopulated = await Purchase.find(query)
    .skip(skip)
    .limit(limit);

  // Populate the necessary fields
  const getAllPurchaseResult = await Purchase.populate(
    getAllPurchaseResultWithoutPopulated,
    [{ path: "purchaseToCustomer" }, { path: "purchaseItems.item" }]
  );

  // Calculate the total sum of voucherTotal across all records matching the query
  const vouchersTotalSum = await Purchase.aggregate([
    { $match: query },
    { $group: { _id: null, totalVoucher: { $sum: "$voucherTotal" } } },
  ]);

  // Fetch total count for pagination info
  const totalPurchase = await Purchase.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All purchases retrieved successfully",
    getAllPurchaseResult,
    totalPurchase, // Include total count for frontend pagination
    currentPage: page,
    totalPages: Math.ceil(totalPurchase / limit),
    vouchersTotalSum: vouchersTotalSum[0]?.totalVoucher || 0, // Handle cases with no matching documents
  });
});

// Get a single purchase by ID (excluding soft-deleted ones)
export const getSinglePurchase = catchAsyncErrors(async (req, res, next) => {
  const getSinglePurchaseResultWithoutPopulated = await Purchase.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!getSinglePurchaseResultWithoutPopulated) {
    return next(new ErrorHandler("Purchase not found or is deleted", 404));
  }

  const getSinglePurchaseResult = await Purchase.populate(
    getSinglePurchaseResultWithoutPopulated,
    [{ path: "purchaseToCustomer" }, { path: "purchaseItems" }]
  );

  res.status(200).json({
    success: true,
    message: "Single purchase retrieved successfully",
    getSinglePurchaseResult,
  });
});

// Update a purchase by ID
export const updatePurchase = catchAsyncErrors(async (req, res, next) => {
  const purchase = await Purchase.findById(req.params.id);

  if (!purchase || purchase.isDeleted) {
    return next(new ErrorHandler("Purchase not found or is deleted", 404));
  }

  const { vchNo, date, ref, day, items, narration, voucherTotal, ledger } =
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

  const updatePurchaseData = {
    vchNo,
    date: formattedDate,
    ref,
    day,
    partyName: ledger.label,
    items,
    narration,
    voucherTotal,
    ledger: ledger.value,
  };

  const updatedPurchase = await Purchase.findByIdAndUpdate(
    req.params.id,
    updatePurchaseData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  const updatedPurchaseResult = await Purchase.populate(updatedPurchase, [
    { path: "purchaseToCustomer" },
    { path: "purchaseItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Purchase updated successfully",
    updatedPurchaseResult,
  });
});

// Soft delete a purchase by ID
export const deletePurchase = catchAsyncErrors(async (req, res, next) => {
  const purchase = await Purchase.findById(req.params.id);

  if (!purchase || purchase.isDeleted) {
    return next(new ErrorHandler("Purchase not found or already deleted", 404));
  }

  purchase.isDeleted = true;
  await purchase.save();

  const deletedPurchaseResult = await Purchase.populate(purchase, [
    { path: "purchaseToCustomer" },
    { path: "purchaseItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Purchase has been moved to recycle bin",
    deletedPurchaseResult,
  });
});

// Restore a soft-deleted purchase by ID
export const restorePurchase = catchAsyncErrors(async (req, res, next) => {
  const purchase = await Purchase.findById(req.params.id);

  if (!purchase || !purchase.isDeleted) {
    return next(new ErrorHandler("Purchase not found or not deleted", 404));
  }

  purchase.isDeleted = false;
  await purchase.save();

  const restoredPurchaseResult = await Purchase.populate(purchase, [
    { path: "purchaseToCustomer" },
    { path: "purchaseItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Purchase has been restored",
    restoredPurchaseResult,
  });
});

// Permanently delete a purchase by ID
export const permanentDeletePurchase = catchAsyncErrors(
  async (req, res, next) => {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return next(new ErrorHandler("Purchase not found", 404));
    }

    await purchase.remove(); // Permanently remove the purchase

    res.status(200).json({
      success: true,
      message: "Purchase has been permanently deleted",
    });
  }
);
