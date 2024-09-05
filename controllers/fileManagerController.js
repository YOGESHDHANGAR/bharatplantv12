import path from "path";
import fs from "fs";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

// These two lines will give you the equivalent of __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = path.join(__dirname, "../utils/uploads");

// Helper function to get details of files recursively
function getFilesRecursive(dir) {
  const results = [];
  const list = fs.readdirSync(dir);

  list.forEach((item) => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      results.push({
        name: item,
        dateCreation: stats.birthtime,
        type: "directory",
        size: stats.size,
        path: itemPath.replace(uploadDir, ""), // Relative path for client-side access
        items: getFilesRecursive(itemPath), // Recursion for subdirectories
      });
    } else {
      results.push({
        name: item,
        dateCreation: stats.birthtime,
        type: "file",
        size: stats.size,
        path: itemPath.replace(uploadDir, ""), // Relative path for client-side access
      });
    }
  });

  return results;
}

// List all files and directories
export const listFiles = catchAsyncErrors(async (req, res, next) => {
  try {
    const items = getFilesRecursive(uploadDir);

    res.status(200).json({
      success: true,
      items,
    });
  } catch (err) {
    return next(new ErrorHandler("Unable to read files", 500));
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Upload files
export const uploadFiles = [
  upload.array("files", 10), // Allows up to 10 files
  catchAsyncErrors(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorHandler("No files uploaded", 400));
    }

    const fileDetails = req.files.map((file) => ({
      fileName: file.filename,
      dateCreation: Date.now(),
      type: file.mimetype,
      size: file.size,
      path: file.filename, // Relative path for client-side access
    }));

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: fileDetails,
    });
  }),
];

// Download a file
export const downloadFile = catchAsyncErrors(async (req, res, next) => {
  const { fileName } = req.params;
  const filePath = path.join(uploadDir, fileName);

  if (!fs.existsSync(filePath)) {
    return next(new ErrorHandler("File not found", 404));
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      return next(new ErrorHandler("Unable to download file", 500));
    }
  });
});

// Delete a file
export const deleteFile = catchAsyncErrors(async (req, res, next) => {
  const { fileName } = req.params;
  const filePath = path.join(uploadDir, fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      return next(new ErrorHandler("Unable to delete file", 500));
    }

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  });
});
