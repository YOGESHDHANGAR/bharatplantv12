import Salary from "../models/salaryModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Create a new salary
export const createSalary = catchAsyncErrors(async (req, res, next) => {
  const {
    selectedEmployee,
    salaryPerMonth,
    workingDayOption,
    startDate,
    endDate,
    paidRecords,
    company,
  } = req.body;

  const createSalaryResult = await Salary.create({
    employeeName: selectedEmployee.label,
    employee: selectedEmployee.value,
    salaryAmount: salaryPerMonth,
    workingDays: workingDayOption,
    workingStartDate: startDate,
    workingEndDate: endDate,
    paidRecords,
    company,
  });

  res.status(201).json({
    success: true,
    message: "Salary created successfully",
    createSalaryResult,
  });
});

// Get all salarys (excluding soft-deleted ones) with pagination and optional filtering
export const getAllSalarys = catchAsyncErrors(async (req, res, next) => {
  const { debouncedGlobalFilter } = req.query;

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 salarys per page
  const skip = (page - 1) * limit;

  // Base query to exclude soft-deleted salarys
  const query = { isDeleted: false };

  // Apply global search filter if provided
  if (debouncedGlobalFilter) {
    const searchRegex = new RegExp(debouncedGlobalFilter, "i");
    const searchNumber = parseFloat(debouncedGlobalFilter);

    query.$or = [
      { salaryName: searchRegex },
      { salaryCode: searchRegex },
      { category: searchRegex },
      { description: searchRegex },
      ...(isNaN(searchNumber)
        ? []
        : [{ price: searchNumber }, { stock: searchNumber }]),
    ];
  }

  // Fetch salarys with pagination
  const getAllSalarysResult = await Salary.find(query).skip(skip).limit(limit);
  console.log("getAllSalarysResult", getAllSalarysResult);

  // Fetch total count for pagination info
  const totalSalarys = await Salary.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All salarys retrieved successfully",
    getAllSalarysResult,
    totalSalarys, // Include total count for frontend pagination
    currentPage: page,
    totalPages: Math.ceil(totalSalarys / limit),
  });
});

// Get a single salary by ID (excluding soft-deleted ones)
export const getSingleSalary = catchAsyncErrors(async (req, res, next) => {
  const getSingleSalaryResult = await Salary.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!getSingleSalaryResult) {
    return next(new ErrorHandler("Salary not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Retrieved single salary",
    getSingleSalaryResult,
  });
});

// Update an salary by ID
export const updateSalary = catchAsyncErrors(async (req, res, next) => {
  const salary = await Salary.findById(req.params.id);

  if (!salary || salary.isDeleted) {
    return next(new ErrorHandler("Salary not found", 404));
  }

  const updatedSalaryData = req.body;

  const updateSalaryResult = await Salary.findByIdAndUpdate(
    req.params.id,
    updatedSalaryData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Salary updated successfully",
    updateSalaryResult,
  });
});

// Soft delete an salary by ID
export const deleteSalary = catchAsyncErrors(async (req, res, next) => {
  const salary = await Salary.findById(req.params.id);

  if (!salary || salary.isDeleted) {
    return next(new ErrorHandler("Salary not found", 404));
  }

  salary.isDeleted = true;
  await salary.save();

  res.status(200).json({
    success: true,
    message: "Salary has been moved to recycle bin",
  });
});

// Restore a soft-deleted salary by ID
export const restoreSalary = catchAsyncErrors(async (req, res, next) => {
  const salary = await Salary.findById(req.params.id);

  if (!salary || !salary.isDeleted) {
    return next(new ErrorHandler("Salary not found or not deleted", 404));
  }

  salary.isDeleted = false;
  await salary.save();

  res.status(200).json({
    success: true,
    message: "Salary has been restored",
  });
});

// Permanently delete an salary by ID
export const permanentDeleteSalary = catchAsyncErrors(
  async (req, res, next) => {
    const salary = await Salary.findById(req.params.id);

    if (!salary) {
      return next(new ErrorHandler("Salary not found", 404));
    }

    await salary.remove(); // Permanently remove the salary

    res.status(200).json({
      success: true,
      message: "Salary has been permanently deleted",
    });
  }
);
