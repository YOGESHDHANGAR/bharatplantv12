import mongoose from "mongoose";
const Schema = mongoose.Schema;

const saleSchema = new Schema({
  vchNo: { type: String },
  date: { type: Date, required: true },
  ref: { type: String },
  day: { type: String, required: true },
  partyName: { type: String, required: true },
  items: [
    {
      itemName: { type: String, required: true },
      itemQuantity: { type: Number },
      itemRate: { type: Number },
      itemUnit: { type: String },
      itemTotal: { type: Number, required: true },
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
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

export default mongoose.model("Sale", saleSchema);
