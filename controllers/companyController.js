import Company from "../models/companyModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const createCompany = catchAsyncErrors(async (req, res, next) => {
  const { companyName } = req.body;

  const createCompanyResult = await Company.create({
    companyName,
  });

  res.status(200).json({
    success: true,
    createCompanyResult,
  });
});

// Get all companies (excluding soft-deleted ones) with pagination and filtering
export const getAllCompanys = catchAsyncErrors(async (req, res, next) => {
  const { dateRange, debouncedGlobalFilter } = req.query;

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  const query = { isDeleted: false };

  // Handle date range filtering
  if (dateRange) {
    const parsedDateRange = JSON.parse(dateRange);
    query.createdAt = {
      $gte: new Date(parsedDateRange.startDate),
      $lte: new Date(parsedDateRange.endDate),
    };
  }

  // Handle global search filtering
  if (debouncedGlobalFilter) {
    const searchRegex = new RegExp(debouncedGlobalFilter, "i");
    query.$or = [
      { companyName: searchRegex },
      // Add more fields as necessary
    ];
  }

  // Fetch companies with pagination
  const getAllCompanysResult = await Company.find(query)
    .skip(skip)
    .limit(limit);

  // Fetch total count for pagination info
  const totalCompanys = await Company.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All companies retrieved successfully",
    getAllCompanysResult,
    totalCompanys, // Include total count for frontend pagination
    currentPage: page,
    totalPages: Math.ceil(totalCompanys / limit),
  });
});

export const getSingleCompany = catchAsyncErrors(async (req, res, next) => {
  const getSingleCompanyResult = await Company.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!getSingleCompanyResult) {
    return next(new ErrorHandler("Company Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Single company Result",
    getSingleCompanyResult,
  });
});

export const updateCompany = catchAsyncErrors(async (req, res, next) => {
  const companyId = req.params.id;
  const updatecompanyData = req.body;

  // Check if the company exists
  const company = await Company.findById(companyId);

  if (!company) {
    return next(new ErrorHandler("Company Not Found", 404));
  }

  // Set isOpened to false for all other companies
  await Company.updateMany({ _id: { $ne: companyId } }, { isOpened: false });

  // Update the selected company
  const updateCompanyResult = await Company.findByIdAndUpdate(
    companyId,
    updatecompanyData,
    {
      new: true, // Return the modified document instead of the original one
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Company updated successfully",
    updateCompanyResult,
  });
});

export const deleteCompany = catchAsyncErrors(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return next(new ErrorHandler("Company Not Found", 404));
  }

  company.isDeleted = true;
  await company.save();

  res.status(200).json({
    success: true,
    message: "Company has been moved to recycle bin",
  });
});

export const restoreCompany = catchAsyncErrors(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return next(new ErrorHandler("Company Not Found", 404));
  }

  company.isDeleted = false;
  await company.save();

  res.status(200).json({
    success: true,
    message: "Company has been restored",
  });
});

export const permanentDeleteCompany = catchAsyncErrors(
  async (req, res, next) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return next(new ErrorHandler("Company Not Found", 404));
    }

    await company.remove();

    res.status(200).json({
      success: true,
      message: "Company has been permanently deleted",
    });
  }
);
