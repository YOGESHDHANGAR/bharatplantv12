import mongoose from "mongoose";
const bankStatementSchema = mongoose.Schema({
  date: {
    type: String,
    required: [true, "Please Enter Transaction Date"],
  },
  narration: {
    type: String,
    required: [true, "Please Enter Transaction Narration"],
    trim: true,
  },
  withdrawal: {
    type: Number,
    default: 0, // Default to 0 if there is no withdrawal
  },
  deposit: {
    type: Number,
    default: 0, // Default to 0 if there is no deposit
  },
  balance: {
    type: String,
    required: [true, "Please Enter Account Balance"],
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

// Create a unique index
bankStatementSchema.index(
  { date: 1, narration: 1, withdrawal: 1, deposit: 1, balance: 1 },
  { unique: true }
);

export default mongoose.model("BankStatement", bankStatementSchema);
