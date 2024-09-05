import mongoose from "mongoose";

const expenseSchema = mongoose.Schema({
  expenseName: {
    type: String,
    required: [true, "Please Enter Expense Name"],
    trim: true,
  },
  expenseUnit: {
    type: String,
    required: [true, "Please Enter Expense Unit"],
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

export default mongoose.model("Expense", expenseSchema);
