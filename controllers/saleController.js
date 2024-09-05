import Sale from "../models/saleModel.js";
import moment from "moment";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Create a new sale
export const createSale = catchAsyncErrors(async (req, res, next) => {
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

  const createSaleResult = await Sale.create({
    vchNo,
    date: formattedDate,
    ref,
    day,
    partyName: ledger.label,
    items,
    narration,
    voucherTotal,
    company: "66c8cf8d044dd7b4537a594e",
    ledger: ledger.value,
  });

  res.status(201).json({
    success: true,
    message: "Sale created successfully",
    createSaleResult,
  });
});

export const getAllSales = catchAsyncErrors(async (req, res, next) => {
  const { dateRange, debouncedGlobalFilter } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = { isDeleted: false };

  if (dateRange) {
    const parsedDateRange = JSON.parse(dateRange);
    query.date = {
      $gte: new Date(parsedDateRange.startDate),
      $lte: new Date(parsedDateRange.endDate),
    };
  }

  if (debouncedGlobalFilter) {
    const searchRegex = new RegExp(debouncedGlobalFilter, "i");
    const searchNumber = parseFloat(debouncedGlobalFilter);

    query.$or = [
      { vchNo: searchRegex },
      { ref: searchRegex },
      { day: searchRegex },
      { partyName: searchRegex },
      { "items.itemName": searchRegex },
      { narration: searchRegex },
      ...(isNaN(searchNumber) ? [] : [{ voucherTotal: searchNumber }]),
    ];
  }

  // Fetch sales with pagination
  const getAllSalesResultWithoutPopulated = await Sale.find(query)
    .skip(skip)
    .limit(limit);

  // Populate necessary fields
  const getAllSalesResult = await Sale.populate(
    getAllSalesResultWithoutPopulated,
    [{ path: "ledger" }, { path: "company" }, { path: "items.item" }]
  );

  // Calculate the total sum of voucherTotal across all records matching the query
  const vouchersTotalSum = await Sale.aggregate([
    { $match: query },
    { $group: { _id: null, totalVoucher: { $sum: "$voucherTotal" } } },
  ]);

  const totalSales = await Sale.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All sales retrieved successfully",
    getAllSalesResult,
    totalSales,
    currentPage: page,
    totalPages: Math.ceil(totalSales / limit),
    vouchersTotalSum: vouchersTotalSum[0]?.totalVoucher || 0, // Handle cases with no matching documents
  });
});

// Get a single sale by ID (excluding soft-deleted ones)
export const getSingleSale = catchAsyncErrors(async (req, res, next) => {
  const getSingleSaleResultWithoutPopulated = await Sale.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!getSingleSaleResultWithoutPopulated) {
    return next(new ErrorHandler("Sale not found or is deleted", 404));
  }

  const getSingleSaleResult = await Sale.populate(
    getSingleSaleResultWithoutPopulated,
    [{ path: "saleToCustomer" }, { path: "saleItems" }]
  );

  res.status(200).json({
    success: true,
    message: "Single sale retrieved successfully",
    getSingleSaleResult,
  });
});

// Update a sale by ID
export const updateSale = catchAsyncErrors(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);

  if (!sale || sale.isDeleted) {
    return next(new ErrorHandler("Sale not found or is deleted", 404));
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

  const updateSaleData = {
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

  const updatedSale = await Sale.findByIdAndUpdate(
    req.params.id,
    updateSaleData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  const updatedSaleResult = await Sale.populate(updatedSale, [
    { path: "saleToCustomer" },
    { path: "saleItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Sale updated successfully",
    updatedSaleResult,
  });
});

// Soft delete a sale by ID
export const deleteSale = catchAsyncErrors(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);

  if (!sale || sale.isDeleted) {
    return next(new ErrorHandler("Sale not found or already deleted", 404));
  }

  sale.isDeleted = true;
  await sale.save();

  const deletedSaleResult = await Sale.populate(sale, [
    { path: "saleToCustomer" },
    { path: "saleItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Sale has been moved to recycle bin",
    deletedSaleResult,
  });
});

// Restore a soft-deleted sale by ID
export const restoreSale = catchAsyncErrors(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);

  if (!sale || !sale.isDeleted) {
    return next(new ErrorHandler("Sale not found or not deleted", 404));
  }

  sale.isDeleted = false;
  await sale.save();

  const restoredSaleResult = await Sale.populate(sale, [
    { path: "saleToCustomer" },
    { path: "saleItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Sale has been restored",
    restoredSaleResult,
  });
});

// Permanently delete a sale by ID
export const permanentDeleteSale = catchAsyncErrors(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);

  if (!sale) {
    return next(new ErrorHandler("Sale not found", 404));
  }

  await sale.remove(); // Permanently remove the sale

  res.status(200).json({
    success: true,
    message: "Sale has been permanently deleted",
  });
});
