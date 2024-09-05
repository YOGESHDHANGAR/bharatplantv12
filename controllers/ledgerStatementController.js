import mongoose from "mongoose";
import Sale from "../models/saleModel.js";
import Purchase from "../models/purchaseModel.js";
import Receipt from "../models/receiptModel.js";
import Payment from "../models/paymentModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const getLedgerStatement = catchAsyncErrors(async (req, res, next) => {
  const ledger = req.query.ledgerId;

  if (!ledger) {
    return next(new ErrorHandler("Ledger ID is required", 400));
  }

  const { dateRange, debouncedGlobalFilter } = req.query;

  // Pagination setup
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build the query object with ledger, date range, and filter
  const query = { ledger, isDeleted: false };

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

    const textSearchQuery = {
      $or: [
        { vchNo: searchRegex },
        { ref: searchRegex },
        { day: searchRegex },
        { partyName: searchRegex },
        { narration: searchRegex },
        ...(isNaN(searchNumber) ? [] : [{ voucherTotal: searchNumber }]),
      ],
    };

    // Fetch all relevant records without pagination
    const [sales, purchases, receipts, payments] = await Promise.all([
      Sale.find({ ...query, ...textSearchQuery }).lean(),
      Purchase.find({ ...query, ...textSearchQuery }).lean(),
      Receipt.find({ ...query, ...textSearchQuery }).lean(),
      Payment.find({ ...query, ...textSearchQuery }).lean(),
    ]);

    // Combine all records with the appropriate type
    const allRecords = [
      ...sales.map((sale) => ({ ...sale, type: "Sale" })),
      ...purchases.map((purchase) => ({ ...purchase, type: "Purchase" })),
      ...receipts.map((receipt) => ({ ...receipt, type: "Receipt" })),
      ...payments.map((payment) => ({ ...payment, type: "Payment" })),
    ];

    // Calculate the total balance based on all matching records
    const balance = allRecords.reduce((total, row) => {
      switch (row.type) {
        case "Sale":
        case "Receipt":
          return total + (row.voucherTotal || 0);
        case "Purchase":
        case "Payment":
          return total - (row.voucherTotal || 0);
        default:
          return total;
      }
    }, 0);

    // Apply pagination after calculating balance
    const paginatedRecords = allRecords.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      message: "Ledger statement retrieved successfully",
      getLedgerStatementResult: paginatedRecords,
      totalLedgerStatementRecords: allRecords.length,
      currentPage: page,
      totalPages: Math.ceil(allRecords.length / limit),
      balance, // Include balance in the response
    });
  } else {
    // If no filter, just return all records
    const [sales, purchases, receipts, payments] = await Promise.all([
      Sale.find(query).lean(),
      Purchase.find(query).lean(),
      Receipt.find(query).lean(),
      Payment.find(query).lean(),
    ]);

    const allRecords = [
      ...sales.map((sale) => ({ ...sale, type: "Sale" })),
      ...purchases.map((purchase) => ({ ...purchase, type: "Purchase" })),
      ...receipts.map((receipt) => ({ ...receipt, type: "Receipt" })),
      ...payments.map((payment) => ({ ...payment, type: "Payment" })),
    ];

    // Sort records by date
    allRecords.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate the total balance based on all matching records
    const balance = allRecords.reduce((total, row) => {
      switch (row.type) {
        case "Sale":
        case "Receipt":
          return total + (row.voucherTotal || 0);
        case "Purchase":
        case "Payment":
          return total - (row.voucherTotal || 0);
        default:
          return total;
      }
    }, 0);

    // Apply pagination after calculating balance
    const paginatedRecords = allRecords.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      message: "Ledger statement retrieved successfully",
      getLedgerStatementResult: paginatedRecords,
      totalLedgerStatementRecords: allRecords.length,
      currentPage: page,
      totalPages: Math.ceil(allRecords.length / limit),
      balance, // Include balance in the response
    });
  }
});
