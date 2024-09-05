import path from "path";
import fs from "fs";
import multer from "multer";
import mongoose from "mongoose";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import File from "../models/fileSchema.js";

// These two lines will give you the equivalent of __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the upload directory
const uploadDir = path.join(__dirname, "../uploads");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname.replace(/ /g, "_"); // Replace spaces with underscores
    cb(null, originalName); // Save with original filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // 10 GB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes =
      /jpeg|jpg|png|gif|bmp|tiff|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|rtf|html|htm|csv|zip|rar|7z|mp3|wav|mp4|mkv|avi|mov|flv|wmv|ogg|webm|json|xml|svg|ico|psd|ai|eps|indd|xd|sketch/;

    const extName = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    const isValidExt = allowedTypes.test(extName);
    const isValidMime =
      mimeType === "text/plain" || allowedTypes.test(mimeType);

    if (isValidExt && isValidMime) {
      return cb(null, true);
    } else {
      console.log(
        `Rejected file: ${file.originalname}, MIME type: ${file.mimetype}`
      );
      return cb(new ErrorHandler("Invalid file type", 400));
    }
  },
});

// Upload files and save metadata to MongoDB
export const uploadFiles = [
  upload.array("files", 1000), // Allows up to 25 files
  catchAsyncErrors(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorHandler("No files uploaded", 400));
    }

    const fileDetails = req.files.map((file) => ({
      fileName: file.filename, // Store the original filename
      type: file.mimetype,
      size: file.size,
      path: path.join(uploadDir, file.filename).replace(uploadDir, ""),
    }));

    // Save file details to MongoDB
    await File.insertMany(fileDetails);

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: fileDetails,
    });
  }),
];

export const getAllFiles = catchAsyncErrors(async (req, res, next) => {
  const { debouncedGlobalFilter, includeDeleted } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  const query = {};

  if (!includeDeleted) {
    query.isDeleted = false;
  }

  // Global search filter
  if (debouncedGlobalFilter) {
    const searchRegex = new RegExp(debouncedGlobalFilter, "i");
    query.$or = [{ fileName: searchRegex }, { type: searchRegex }];
  }

  // Fetch files with pagination
  const getAllFilesResult = await File.find(query).skip(skip).limit(limit);
  const totalFiles = await File.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "All files retrieved successfully",
    getAllFilesResult,
    totalFiles,
    currentPage: page,
    totalPages: Math.ceil(totalFiles / limit),
  });
});

export const deleteFile = catchAsyncErrors(async (req, res, next) => {
  console.log("cad");
  const { id } = req.params;

  // Find the file in the database by ID
  const file = await File.findById(id);

  if (!file || file.isDeleted) {
    return next(new ErrorHandler("File not found or already deleted", 404));
  }

  // Mark the file as deleted
  file.isDeleted = true;
  await file.save();

  res.status(200).json({
    success: true,
    message: "File has been moved to recycle bin",
    file,
  });
});

export const restoreFile = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Find the file in the database by ID
  const file = await File.findById(id);

  if (!file || !file.isDeleted) {
    return next(new ErrorHandler("File not found or not deleted", 404));
  }

  // Restore the file
  file.isDeleted = false;
  await file.save();

  res.status(200).json({
    success: true,
    message: "File has been restored",
    file,
  });
});

export const permanentDeleteFile = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Find the file in the database by ID
  const file = await File.findById(id);

  if (!file) {
    return next(new ErrorHandler("File not found", 404));
  }

  const filePath = path.join(uploadDir, file.fileName);

  // Remove the file from the filesystem
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Permanently remove the file metadata from the database
  await File.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: "File has been permanently deleted",
  });
});
