import Payment from "../models/paymentModel.js";
import moment from "moment";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Create a new payment
export const createPayment = catchAsyncErrors(async (req, res, next) => {
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

  const createPaymentResult = await Payment.create({
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
    message: "Payment created successfully",
    createPaymentResult,
  });
});

// Get all Payments (excluding soft-deleted ones) with pagination, date filtering, and search functionality
export const getAllPayments = catchAsyncErrors(async (req, res, next) => {
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

  // Fetch payments with pagination and exclude soft-deleted ones
  const getAllPaymentsResultWithoutPopulated = await Payment.find(query)
    .skip(skip)
    .limit(limit);

  // Populate the necessary fields
  const getAllPaymentsResult = await Payment.populate(
    getAllPaymentsResultWithoutPopulated,
    [{ path: "ledger" }, { path: "company" }]
  );

  // Calculate the total sum of paymentTotal across all records matching the query
  const vouchersTotalSum = await Payment.aggregate([
    { $match: query },
    { $group: { _id: null, totalVoucher: { $sum: "$voucherTotal" } } },
  ]);

  // Fetch total count for pagination info
  const totalPayments = await Payment.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All payments retrieved successfully",
    getAllPaymentsResult,
    totalPayments, // Include total count for frontend pagination
    currentPage: page,
    totalPages: Math.ceil(totalPayments / limit),
    vouchersTotalSum: vouchersTotalSum[0]?.totalVoucher || 0, // Handle cases with no matching documents
  });
});

// Get a single payment by ID (excluding soft-deleted ones)
export const getSinglePayment = catchAsyncErrors(async (req, res, next) => {
  const getSinglePaymentResultWithoutPopulated = await Payment.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!getSinglePaymentResultWithoutPopulated) {
    return next(new ErrorHandler("Payment not found or is deleted", 404));
  }

  const getSinglePaymentResult = await Payment.populate(
    getSinglePaymentResultWithoutPopulated,
    [{ path: "paymentToCustomer" }, { path: "paymentItems" }]
  );

  res.status(200).json({
    success: true,
    message: "Single payment retrieved successfully",
    getSinglePaymentResult,
  });
});

// Update a payment by ID
export const updatePayment = catchAsyncErrors(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment || payment.isDeleted) {
    return next(new ErrorHandler("Payment not found or is deleted", 404));
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

  const updatePaymentData = {
    vchNo,
    date: formattedDate,
    ref,
    day,
    partyName: partyName.value,
    modes,
    narration,
    voucherTotal,
  };

  const updatedPayment = await Payment.findByIdAndUpdate(
    req.params.id,
    updatePaymentData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  const updatedPaymentResult = await Payment.populate(updatedPayment, [
    { path: "paymentToCustomer" },
    { path: "paymentItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Payment updated successfully",
    updatedPaymentResult,
  });
});

// Soft delete a payment by ID
export const deletePayment = catchAsyncErrors(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment || payment.isDeleted) {
    return next(new ErrorHandler("Payment not found or already deleted", 404));
  }

  payment.isDeleted = true;
  await payment.save();

  const deletedPaymentResult = await Payment.populate(payment, [
    { path: "paymentToCustomer" },
    { path: "paymentItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Payment has been moved to recycle bin",
    deletedPaymentResult,
  });
});

// Restore a soft-deleted payment by ID
export const restorePayment = catchAsyncErrors(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment || !payment.isDeleted) {
    return next(new ErrorHandler("Payment not found or not deleted", 404));
  }

  payment.isDeleted = false;
  await payment.save();

  const restoredPaymentResult = await Payment.populate(payment, [
    { path: "paymentToCustomer" },
    { path: "paymentItems" },
  ]);

  res.status(200).json({
    success: true,
    message: "Payment has been restored",
    restoredPaymentResult,
  });
});

// Permanently delete a payment by ID
export const permanentDeletePayment = catchAsyncErrors(
  async (req, res, next) => {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return next(new ErrorHandler("Payment not found", 404));
    }

    await payment.remove(); // Permanently remove the payment

    res.status(200).json({
      success: true,
      message: "Payment has been permanently deleted",
    });
  }
);
