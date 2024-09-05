import Item from "../models/itemModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Create a new item
export const createItem = catchAsyncErrors(async (req, res, next) => {
  const { itemName, itemUnit, company } = req.body;

  const createItemResult = await Item.create({
    itemName,
    itemUnit,
    company,
  });

  res.status(201).json({
    success: true,
    message: "Item created successfully",
    createItemResult,
  });
});

// Get all items (excluding soft-deleted ones) with pagination and optional filtering
export const getAllItems = catchAsyncErrors(async (req, res, next) => {
  const { debouncedGlobalFilter } = req.query;

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  // Base query to exclude soft-deleted items
  const query = { isDeleted: false };

  // Apply global search filter if provided
  if (debouncedGlobalFilter) {
    const searchRegex = new RegExp(debouncedGlobalFilter, "i");
    const searchNumber = parseFloat(debouncedGlobalFilter);

    query.$or = [
      { itemName: searchRegex },
      { itemCode: searchRegex },
      { category: searchRegex },
      { description: searchRegex },
      ...(isNaN(searchNumber)
        ? []
        : [{ price: searchNumber }, { stock: searchNumber }]),
    ];
  }

  // Fetch items with pagination
  const getAllItemsResult = await Item.find(query).skip(skip).limit(limit);

  // Fetch total count for pagination info
  const totalItems = await Item.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All items retrieved successfully",
    getAllItemsResult,
    totalItems, // Include total count for frontend pagination
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
  });
});

// Get a single item by ID (excluding soft-deleted ones)
export const getSingleItem = catchAsyncErrors(async (req, res, next) => {
  const getSingleItemResult = await Item.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!getSingleItemResult) {
    return next(new ErrorHandler("Item not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Retrieved single item",
    getSingleItemResult,
  });
});

// Update an item by ID
export const updateItem = catchAsyncErrors(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item || item.isDeleted) {
    return next(new ErrorHandler("Item not found", 404));
  }

  const updatedItemData = req.body;

  const updateItemResult = await Item.findByIdAndUpdate(
    req.params.id,
    updatedItemData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Item updated successfully",
    updateItemResult,
  });
});

// Soft delete an item by ID
export const deleteItem = catchAsyncErrors(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item || item.isDeleted) {
    return next(new ErrorHandler("Item not found", 404));
  }

  item.isDeleted = true;
  await item.save();

  res.status(200).json({
    success: true,
    message: "Item has been moved to recycle bin",
  });
});

// Restore a soft-deleted item by ID
export const restoreItem = catchAsyncErrors(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item || !item.isDeleted) {
    return next(new ErrorHandler("Item not found or not deleted", 404));
  }

  item.isDeleted = false;
  await item.save();

  res.status(200).json({
    success: true,
    message: "Item has been restored",
  });
});

// Permanently delete an item by ID
export const permanentDeleteItem = catchAsyncErrors(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorHandler("Item not found", 404));
  }

  await item.remove(); // Permanently remove the item

  res.status(200).json({
    success: true,
    message: "Item has been permanently deleted",
  });
});
