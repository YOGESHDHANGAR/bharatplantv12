import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "Please Enter Item Name"],
    trim: true,
  },
  itemUnit: {
    type: String,
    required: [true, "Please Enter Item Unit"],
    trim: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Item", itemSchema);
