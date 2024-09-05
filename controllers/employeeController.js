import Employee from "../models/employeeModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const createEmployee = catchAsyncErrors(async (req, res, next) => {
  const { employeeName, employeeType, company } = req.body;

  const createEmployeeResult = await Employee.create({
    employeeName,
    employeeType,
    company,
  });

  res.status(200).json({
    success: true,
    createEmployeeResult,
  });
});

// Get all employees (excluding soft-deleted ones) with pagination and optional filtering
export const getAllEmployees = catchAsyncErrors(async (req, res, next) => {
  const { debouncedGlobalFilter } = req.query;

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  // Base query to exclude soft-deleted employees
  const query = { isDeleted: false };

  // Apply global search filter if provided
  if (debouncedGlobalFilter) {
    const searchRegex = new RegExp(debouncedGlobalFilter, "i");
    const searchNumber = parseFloat(debouncedGlobalFilter);

    query.$or = [{ employeeName: searchRegex }, { employeeType: searchRegex }];
  }

  // Fetch employees with pagination
  const getAllEmployeesResult = await Employee.find(query)
    .skip(skip)
    .limit(limit);

  // Fetch total count for pagination info
  const totalEmployees = await Employee.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All employees retrieved successfully",
    getAllEmployeesResult,
    totalEmployees, // Include total count for frontend pagination
    currentPage: page,
    totalPages: Math.ceil(totalEmployees / limit),
  });
});

export const getSingleEmployee = catchAsyncErrors(async (req, res, next) => {
  const getSingleEmployeeResult = await Employee.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!getSingleEmployeeResult) {
    return next(new ErrorHandler("Employee Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Single employee Result",
    getSingleEmployeeResult,
  });
});

export const updateEmployee = catchAsyncErrors(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorHandler("Employee Not Found", 404));
  }

  const updatedEmployeeData = req.body;

  const updatedEmployeeResult = await Employee.findByIdAndUpdate(
    req.params.id,
    updatedEmployeeData,
    {
      new: true, // Return the modified document instead of the original one
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Single employee Result",
    updatedEmployeeResult,
  });
});

export const deleteEmployee = catchAsyncErrors(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorHandler("Employee Not Found", 404));
  }

  employee.isDeleted = true;
  await employee.save();

  res.status(200).json({
    success: true,
    message: "Employee has been moved to recycle bin",
  });
});

export const restoreEmployee = catchAsyncErrors(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorHandler("Employee Not Found", 404));
  }

  employee.isDeleted = false;
  await employee.save();

  res.status(200).json({
    success: true,
    message: "Employee has been restored",
  });
});

export const permanentDeleteEmployee = catchAsyncErrors(
  async (req, res, next) => {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return next(new ErrorHandler("Employee Not Found", 404));
    }

    await employee.remove();

    res.status(200).json({
      success: true,
      message: "Employee has been permanently deleted",
    });
  }
);
