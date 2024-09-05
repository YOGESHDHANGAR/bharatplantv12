import Company from "../models/companyModel.js";
import Employee from "../models/employeeModel.js";
import Item from "../models/itemModel.js";
import Ledger from "../models/ledgerModel.js";
import Payment from "../models/paymentModel.js";
import Purchase from "../models/purchaseModel.js";
import Receipt from "../models/receiptModel.js";
import Sale from "../models/saleModel.js";
import File from "../models/fileSchema.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorhandler.js";

// Retrieve all soft-deleted items from all modules with pagination and filtering
export const getAllDeletedParticulars = catchAsyncErrors(
  async (req, res, next) => {
    const { debouncedGlobalFilter } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isDeleted: true };

    if (debouncedGlobalFilter) {
      const searchRegex = new RegExp(debouncedGlobalFilter, "i");
      const searchNumber = parseFloat(debouncedGlobalFilter);

      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { fileName: searchRegex },
        { type: searchRegex },
        ...(isNaN(searchNumber)
          ? []
          : [{ amount: searchNumber }, { size: searchNumber }]),
      ];
    }

    // Fetch deleted items from each module
    const [
      deletedCompanies,
      deletedEmployees,
      deletedItems,
      deletedLedgers,
      deletedPayments,
      deletedPurchases,
      deletedReceipts,
      deletedSales,
      deletedFiles,
    ] = await Promise.all([
      Company.find(query),
      Employee.find(query),
      Item.find(query),
      Ledger.find(query),
      Payment.find(query),
      Purchase.find(query),
      Receipt.find(query),
      Sale.find(query),
      File.find(query),
    ]);

    // Combine all results into a single array
    const combinedResults = [
      ...deletedCompanies.map((item) => ({ _id: item._id, type: "Company" })),
      ...deletedEmployees.map((item) => ({ _id: item._id, type: "Employee" })),
      ...deletedItems.map((item) => ({ _id: item._id, type: "Item" })),
      ...deletedLedgers.map((item) => ({ _id: item._id, type: "Ledger" })),
      ...deletedPayments.map((item) => ({ _id: item._id, type: "Payment" })),
      ...deletedPurchases.map((item) => ({ _id: item._id, type: "Purchase" })),
      ...deletedReceipts.map((item) => ({ _id: item._id, type: "Receipt" })),
      ...deletedSales.map((item) => ({ _id: item._id, type: "Sale" })),
      ...deletedFiles.map((item) => ({ _id: item._id, type: "File" })),
    ];

    // Paginate combined results
    const paginatedResults = combinedResults.slice(skip, skip + limit);

    // Calculate the total count
    const totalDeletedParticulars = combinedResults.length;

    res.status(200).json({
      success: true,
      message: "All deleted items retrieved successfully",
      getAllRecycleBinItemsResult: paginatedResults,
      totalDeletedParticulars,
      currentPage: page,
      totalPages: Math.ceil(totalDeletedParticulars / limit),
    });
  }
);

// Restore function
export const restoreParticular = catchAsyncErrors(async (req, res, next) => {
  console.log("called ion ");
  const { type, id } = req.params;

  let model;

  switch (type) {
    case "Company":
      model = Company;
      break;
    case "Employee":
      model = Employee;
      break;
    case "Item":
      model = Item;
      break;
    case "Ledger":
      model = Ledger;
      break;
    case "Payment":
      model = Payment;
      break;
    case "Purchase":
      model = Purchase;
      break;
    case "Receipt":
      model = Receipt;
      break;
    case "Sale":
      model = Sale;
      break;
    case "File":
      model = File;
      break;
    default:
      return next(new ErrorHandler("Invalid type", 400));
  }

  const item = await model.findById(id);

  if (!item || !item.isDeleted) {
    return next(new ErrorHandler(`${type} not found or not deleted`, 404));
  }

  item.isDeleted = false;
  await item.save(); // Restore the item

  res.status(200).json({
    success: true,
    message: `${type} has been restored`,
  });
});

// Permanent delete function
export const permanentDeleteParticular = catchAsyncErrors(
  async (req, res, next) => {
    const { type, id } = req.params;

    let model;

    switch (type) {
      case "Company":
        model = Company;
        break;
      case "Employee":
        model = Employee;
        break;
      case "Item":
        model = Item;
        break;
      case "Ledger":
        model = Ledger;
        break;
      case "Payment":
        model = Payment;
        break;
      case "Purchase":
        model = Purchase;
        break;
      case "Receipt":
        model = Receipt;
        break;
      case "Sale":
        model = Sale;
        break;
      case "File":
        model = File;
        break;
      default:
        return next(new ErrorHandler("Invalid type", 400));
    }

    // Find and delete the item
    const result = await model.findByIdAndDelete(id);

    if (!result) {
      return next(new ErrorHandler(`${type} not found`, 404));
    }

    res.status(200).json({
      success: true,
      message: `${type} has been permanently deleted`,
    });
  }
);
