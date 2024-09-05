import mongoose from "mongoose";

const employeeSchema = mongoose.Schema({
  employeeName: {
    type: String,
    required: [true, "Please Enter Employee Name"],
    trim: true,
  },
  employeeType: {
    type: String,
    required: [true, "Please Enter Employee Type"],
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

export default mongoose.model("Employee", employeeSchema);
