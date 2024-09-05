import mongoose from "mongoose";
const Schema = mongoose.Schema;

const receiptSchema = new Schema({
  vchNo: { type: String },
  date: { type: Date, required: true },
  ref: { type: String },
  day: { type: String, required: true },
  partyName: { type: String, required: true },
  modes: [
    {
      modeType: { type: String, required: true },
      modeAmount: { type: Number, required: true },
    },
  ],
  narration: { type: String, default: "" },
  voucherTotal: { type: Number, required: true },
  ledger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger",
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

export default mongoose.model("Receipt", receiptSchema);
