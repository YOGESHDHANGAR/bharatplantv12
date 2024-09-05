import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileName: String,
  dateCreation: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now }, // Add dateModified
  type: String,
  size: Number,
  path: String, // Relative path for client-side access
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Middleware to update dateModified on document update
fileSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.dateModified = Date.now();
  }
  next();
});

export default mongoose.model("File", fileSchema);
