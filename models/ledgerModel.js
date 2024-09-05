import mongoose from "mongoose";

const ledgerSchema = mongoose.Schema({
  ledgerName: {
    type: String,
    required: [true, "Please Enter Ledger Name"],
    trim: true,
  },
  ledgerType: {
    type: String,
    required: [true, "Please Enter Ledger Type"],
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

export default mongoose.model("Ledger", ledgerSchema);
