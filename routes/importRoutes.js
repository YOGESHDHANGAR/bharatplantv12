// routes/tableRoutes.js
import express from "express";

import {
  queryConfig,
  queryMstCostCategory,
  queryMstCostCentre,
  queryMstGodown,
  queryMstGroup,
  queryMstGstEffectiveRate,
  queryMstLedger,
  queryMstOpeningBatchAllocation,
  queryMstOpeningBillAllocation,
  queryMstStockGroup,
  queryMstStockItem,
  queryMstUom,
  queryTrnAccounting,
  queryTrnBatch,
  queryTrnBill,
  queryTrnCostCentre,
  queryTrnInventory,
  queryTrnVoucher,
  queryMstVoucherType,
  queryTrnClosingStockLedger,
} from "../controllers/importController.js";
const importRoutes = express.Router();

importRoutes.get("/import/config", queryConfig);
importRoutes.get("/import/mst_cost_category", queryMstCostCategory);
importRoutes.get("/import/mst_cost_centre", queryMstCostCentre);
importRoutes.get("/import/mst_godown", queryMstGodown);
importRoutes.get("/import/mst_group", queryMstGroup);
importRoutes.get("/import/mst_gst_effective_rate", queryMstGstEffectiveRate);
importRoutes.get("/import/mst_ledger", queryMstLedger);
importRoutes.get(
  "/import/mst_opening_batch_allocation",
  queryMstOpeningBatchAllocation
);
importRoutes.get(
  "/import/mst_opening_bill_allocation",
  queryMstOpeningBillAllocation
);
importRoutes.get("/import/mst_stock_group", queryMstStockGroup);
importRoutes.get("/import/mst_stock_item", queryMstStockItem);
importRoutes.get("/import/mst_uom", queryMstUom);
importRoutes.get("/import/mst_vouchertype", queryMstVoucherType);
importRoutes.get("/import/trn_accounting", queryTrnAccounting);
importRoutes.get("/import/trn_batch", queryTrnBatch);
importRoutes.get("/import/trn_bill", queryTrnBill);
importRoutes.get("/import/trn_closingstock_ledger", queryTrnClosingStockLedger);
importRoutes.get("/import/trn_cost_centre", queryTrnCostCentre);
importRoutes.get("/import/trn_inventory", queryTrnInventory);
importRoutes.get("/import/trn_voucher", queryTrnVoucher);

export default importRoutes;
