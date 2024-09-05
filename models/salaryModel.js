import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: [true, "Please Enter Salary Name"],
    trim: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  salaryAmount: {
    type: String,
    required: [true, "Please Enter Salary Unit"],
    trim: true,
  },
  workingDays: {
    type: String,
  },
  workingStartDate: {
    type: String,
  },
  workingEndDate: {
    type: String,
  },
  paidRecords: [
    {
      date: {
        type: Date,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
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

export default mongoose.model("Salary", salarySchema);
