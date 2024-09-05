import mongoose from "mongoose";
const companySchema = mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Please Enter Company Name"],
    trim: true,
  },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  ledgers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ledger" }],
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sale" }],
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Purchase" }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  receipts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Receipt" }],
  isOpened: {
    type: Boolean,
    default: false,
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

export default mongoose.model("Company", companySchema);
