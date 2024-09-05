import Expense from "../models/expenseModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Create a new expense
export const createExpense = catchAsyncErrors(async (req, res, next) => {
  const { expenseName, expenseUnit, company } = req.body;

  const createExpenseResult = await Expense.create({
    expenseName,
    expenseUnit,
    company,
  });

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    createExpenseResult,
  });
});

// Get all expenses (excluding soft-deleted ones) with pagination and optional filtering
export const getAllExpenses = catchAsyncErrors(async (req, res, next) => {
  const { debouncedGlobalFilter } = req.query;

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 expenses per page
  const skip = (page - 1) * limit;

  // Base query to exclude soft-deleted expenses
  const query = { isDeleted: false };

  // Apply global search filter if provided
  if (debouncedGlobalFilter) {
    const searchRegex = new RegExp(debouncedGlobalFilter, "i");
    const searchNumber = parseFloat(debouncedGlobalFilter);

    query.$or = [
      { expenseName: searchRegex },
      { expenseCode: searchRegex },
      { category: searchRegex },
      { description: searchRegex },
      ...(isNaN(searchNumber)
        ? []
        : [{ price: searchNumber }, { stock: searchNumber }]),
    ];
  }

  // Fetch expenses with pagination
  const getAllExpensesResult = await Expense.find(query)
    .skip(skip)
    .limit(limit);

  // Fetch total count for pagination info
  const totalExpenses = await Expense.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All expenses retrieved successfully",
    getAllExpensesResult,
    totalExpenses, // Include total count for frontend pagination
    currentPage: page,
    totalPages: Math.ceil(totalExpenses / limit),
  });
});

// Get a single expense by ID (excluding soft-deleted ones)
export const getSingleExpense = catchAsyncErrors(async (req, res, next) => {
  const getSingleExpenseResult = await Expense.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!getSingleExpenseResult) {
    return next(new ErrorHandler("Expense not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Retrieved single expense",
    getSingleExpenseResult,
  });
});

// Update an expense by ID
export const updateExpense = catchAsyncErrors(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense || expense.isDeleted) {
    return next(new ErrorHandler("Expense not found", 404));
  }

  const updatedExpenseData = req.body;

  const updateExpenseResult = await Expense.findByIdAndUpdate(
    req.params.id,
    updatedExpenseData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    updateExpenseResult,
  });
});

// Soft delete an expense by ID
export const deleteExpense = catchAsyncErrors(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense || expense.isDeleted) {
    return next(new ErrorHandler("Expense not found", 404));
  }

  expense.isDeleted = true;
  await expense.save();

  res.status(200).json({
    success: true,
    message: "Expense has been moved to recycle bin",
  });
});

// Restore a soft-deleted expense by ID
export const restoreExpense = catchAsyncErrors(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense || !expense.isDeleted) {
    return next(new ErrorHandler("Expense not found or not deleted", 404));
  }

  expense.isDeleted = false;
  await expense.save();

  res.status(200).json({
    success: true,
    message: "Expense has been restored",
  });
});

// Permanently delete an expense by ID
export const permanentDeleteExpense = catchAsyncErrors(
  async (req, res, next) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return next(new ErrorHandler("Expense not found", 404));
    }

    await expense.remove(); // Permanently remove the expense

    res.status(200).json({
      success: true,
      message: "Expense has been permanently deleted",
    });
  }
);
