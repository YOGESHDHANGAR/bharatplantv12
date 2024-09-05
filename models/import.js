import mongoose from "mongoose";

// Config Schema
const configSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: String, default: "" },
});

// Group Schema
const groupSchema = mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  alterid: { type: Number, default: 0 },
  name: { type: String, default: "" },
  parent: { type: String, default: "" },
  _parent: { type: String, default: "" },
  primary_group: { type: String, default: "" },
  is_revenue: { type: Boolean, default: false },
  is_deemedpositive: { type: Boolean, default: false },
  is_reserved: { type: Boolean, default: false },
  affects_gross_profit: { type: Boolean, default: false },
  sort_position: { type: Number, default: 0 },
});

// Ledger Schema
const ledgerSchema = mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  alterid: { type: Number, default: 0 },
  name: { type: String, default: "" },
  parent: { type: String, default: "" },
  _parent: { type: String, default: "" },
  alias: { type: String, default: "" },
  is_revenue: { type: Boolean, default: false },
  is_deemedpositive: { type: Boolean, default: false },
  opening_balance: { type: Number, default: 0 },
  description: { type: String, default: "" },
  mailing_name: { type: String, default: "" },
  mailing_address: { type: String, default: "" },
  mailing_state: { type: String, default: "" },
  mailing_country: { type: String, default: "" },
  mailing_pincode: { type: String, default: "" },
  email: { type: String, default: "" },
  it_pan: { type: String, default: "" },
  gstn: { type: String, default: "" },
  gst_registration_type: { type: String, default: "" },
  gst_supply_type: { type: String, default: "" },
  gst_duty_head: { type: String, default: "" },
  tax_rate: { type: Number, default: 0 },
  bank_account_holder: { type: String, default: "" },
  bank_account_number: { type: String, default: "" },
  bank_ifsc: { type: String, default: "" },
  bank_swift: { type: String, default: "" },
  bank_name: { type: String, default: "" },
  bank_branch: { type: String, default: "" },
});

// Voucher Type Schema
const voucherTypeSchema = mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  alterid: { type: Number, default: 0 },
  name: { type: String, default: "" },
  parent: { type: String, default: "" },
  _parent: { type: String, default: "" },
  numbering_method: { type: String, default: "" },
  is_deemedpositive: { type: Boolean, default: false },
  affects_stock: { type: Boolean, default: false },
});

// UOM Schema
const uomSchema = mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  alterid: { type: Number, default: 0 },
  name: { type: String, default: "" },
  formalname: { type: String, default: "" },
  is_simple_unit: { type: Boolean, required: true },
  base_units: { type: String, default: "" },
  additional_units: { type: String, default: "" },
  conversion: { type: Number, default: 0 },
});

// Godown Schema
const godownSchema = mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  alterid: { type: Number, default: 0 },
  name: { type: String, default: "" },
  parent: { type: String, default: "" },
  _parent: { type: String, default: "" },
  address: { type: String, default: "" },
});

// Stock Group Schema
const stockGroupSchema = mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  alterid: { type: Number, default: 0 },
  name: { type: String, default: "" },
  parent: { type: String, default: "" },
  _parent: { type: String, default: "" },
});

// Stock Item Schema
const stockItemSchema = mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  alterid: { type: Number, default: 0 },
  name: { type: String, default: "" },
  parent: { type: String, default: "" },
  _parent: { type: String, default: "" },
  alias: { type: String, default: "" },
  uom: { type: String, default: "" },
  _uom: { type: String, default: "" },
  opening_balance: { type: Number, default: 0 },
  opening_rate: { type: Number, default: 0 },
  opening_value: { type: Number, default: 0 },
  gst_nature_of_goods: { type: String, default: "" },
  gst_hsn_code: { type: String, default: "" },
  gst_taxability: { type: String, default: "" },
});

// Cost Category Schema
const costCategorySchema = mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  alterid: { type: Number, default: 0 },
  name: { type: String, default: "" },
  allocate_revenue: { type: Boolean, default: false },
  allocate_non_revenue: { type: Boolean, default: false },
});

// Cost Centre Schema
const costCentreSchema = mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  alterid: { type: Number, default: 0 },
  name: { type: String, default: "" },
  parent: { type: String, default: "" },
  _parent: { type: String, default: "" },
  category: { type: String, default: "" },
});

// GST Effective Rate Schema
const gstEffectiveRateSchema = mongoose.Schema({
  item: { type: String, default: "" },
  _item: { type: String, default: "" },
  applicable_from: { type: Date },
  hsn_description: { type: String, default: "" },
  hsn_code: { type: String, default: "" },
  rate: { type: Number, default: 0 },
  is_rcm_applicable: { type: Boolean, default: false },
  nature_of_transaction: { type: String, default: "" },
  nature_of_goods: { type: String, default: "" },
  supply_type: { type: String, default: "" },
  taxability: { type: String, default: "" },
});

// Opening Batch Allocation Schema
const openingBatchAllocationSchema = mongoose.Schema({
  item: { type: String, default: "" },
  _item: { type: String, default: "" },
  opening_balance: { type: Number, default: 0 },
  opening_rate: { type: Number, default: 0 },
  opening_value: { type: Number, default: 0 },
  godown: { type: String, default: "" },
  _godown: { type: String, default: "" },
  manufactured_on: { type: Date },
});

// Opening Bill Allocation Schema
const openingBillAllocationSchema = mongoose.Schema({
  ledger: { type: String, default: "" },
  _ledger: { type: String, default: "" },
  opening_balance: { type: Number, default: 0 },
  bill_date: { type: Date },
});

// Closing Stock Ledger Schema
const closingStockLedgerSchema = mongoose.Schema({
  ledger: { type: String, default: "" },
  _ledger: { type: String, default: "" },
  stock_date: { type: Date },
  stock_value: { type: Number, default: 0 },
});

// Voucher Schema
const voucherSchema = mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  alterid: { type: Number, default: 0 },
  date: { type: Date, required: true },
  voucher_type: { type: String, default: "" },
  _voucher_type: { type: String, default: "" },
  voucher_number: { type: String, default: "" },
  reference_number: { type: String, default: "" },
  reference_date: { type: Date },
  narration: { type: String, default: "" },
  party_name: { type: String, default: "" },
  _party_name: { type: String, default: "" },
  place_of_supply: { type: String, default: "" },
  is_invoice: { type: Boolean, default: false },
  is_accounting_voucher: { type: Boolean, default: false },
  is_inventory_voucher: { type: Boolean, default: false },
  is_order_voucher: { type: Boolean, default: false },
});

// Sales Ledger Schema
const salesLedgerSchema = mongoose.Schema({
  ledger: { type: String, default: "" },
  _ledger: { type: String, default: "" },
  sales_date: { type: Date },
  sales_value: { type: Number, default: 0 },
});

// Purchase Ledger Schema
const purchaseLedgerSchema = mongoose.Schema({
  ledger: { type: String, default: "" },
  _ledger: { type: String, default: "" },
  purchase_date: { type: Date },
  purchase_value: { type: Number, default: 0 },
});

// Sales Details Schema
const salesDetailsSchema = mongoose.Schema({
  voucher: { type: String, default: "" },
  _voucher: { type: String, default: "" },
  item: { type: String, default: "" },
  _item: { type: String, default: "" },
  quantity: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  godown: { type: String, default: "" },
  _godown: { type: String, default: "" },
});

// Purchase Details Schema
const purchaseDetailsSchema = mongoose.Schema({
  voucher: { type: String, default: "" },
  _voucher: { type: String, default: "" },
  item: { type: String, default: "" },
  _item: { type: String, default: "" },
  quantity: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  godown: { type: String, default: "" },
  _godown: { type: String, default: "" },
});

// Exporting All Schemas
module.exports = {
  Config: mongoose.model("Config", configSchema),
  Group: mongoose.model("Group", groupSchema),
  Ledger: mongoose.model("Ledger", ledgerSchema),
  VoucherType: mongoose.model("VoucherType", voucherTypeSchema),
  UOM: mongoose.model("UOM", uomSchema),
  Godown: mongoose.model("Godown", godownSchema),
  StockGroup: mongoose.model("StockGroup", stockGroupSchema),
  StockItem: mongoose.model("StockItem", stockItemSchema),
  CostCategory: mongoose.model("CostCategory", costCategorySchema),
  CostCentre: mongoose.model("CostCentre", costCentreSchema),
  GSTEffectiveRate: mongoose.model("GSTEffectiveRate", gstEffectiveRateSchema),
  OpeningBatchAllocation: mongoose.model(
    "OpeningBatchAllocation",
    openingBatchAllocationSchema
  ),
  OpeningBillAllocation: mongoose.model(
    "OpeningBillAllocation",
    openingBillAllocationSchema
  ),
  ClosingStockLedger: mongoose.model(
    "ClosingStockLedger",
    closingStockLedgerSchema
  ),
  Voucher: mongoose.model("Voucher", voucherSchema),
  SalesLedger: mongoose.model("SalesLedger", salesLedgerSchema),
  PurchaseLedger: mongoose.model("PurchaseLedger", purchaseLedgerSchema),
  SalesDetails: mongoose.model("SalesDetails", salesDetailsSchema),
  PurchaseDetails: mongoose.model("PurchaseDetails", purchaseDetailsSchema),
};
