import con from "../databases/mySqlConnection.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const queryConfig = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM config", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch config",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "config fetched successfully",
      results,
    });
  });
});

export const queryMstCostCategory = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM mst_cost_category", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mst_cost_category",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "mst_cost_category fetched successfully",
      results,
    });
  });
});

export const queryMstCostCentre = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM mst_cost_centre", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mst_cost_centre",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "mst_cost_centre fetched successfully",
      results,
    });
  });
});

export const queryMstGodown = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM mst_godown", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mst_godown",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "mst_godown fetched successfully",
      results,
    });
  });
});

export const queryMstGroup = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM mst_group", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mst_group",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "mst_group fetched successfully",
      results,
    });
  });
});

export const queryMstGstEffectiveRate = catchAsyncErrors(
  async (req, res, next) => {
    con.query("SELECT * FROM mst_gst_effective_rate", (err, results) => {
      if (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch mst_gst_effective_rate",
          error: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "mst_gst_effective_rate fetched successfully",
        results,
      });
    });
  }
);

export const queryMstLedger = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM mst_ledger", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mst_ledger",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "mst_ledger fetched successfully",
      results,
    });
  });
});

export const queryMstOpeningBatchAllocation = catchAsyncErrors(
  async (req, res, next) => {
    con.query("SELECT * FROM mst_opening_batch_allocation", (err, results) => {
      if (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch mst_opening_batch_allocation",
          error: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "mst_opening_batch_allocation fetched successfully",
        results,
      });
    });
  }
);

export const queryMstOpeningBillAllocation = catchAsyncErrors(
  async (req, res, next) => {
    con.query("SELECT * FROM mst_opening_bill_allocation", (err, results) => {
      if (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch mst_opening_bill_allocation",
          error: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "mst_opening_bill_allocation fetched successfully",
        results,
      });
    });
  }
);

export const queryMstStockGroup = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM mst_stock_group", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mst_stock_group",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "mst_stock_group fetched successfully",
      results,
    });
  });
});

export const queryMstStockItem = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM mst_stock_item", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mst_stock_item",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "mst_stock_item fetched successfully",
      results,
    });
  });
});

export const queryMstUom = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM mst_uom", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mst_uom",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "mst_uom fetched successfully",
      results,
    });
  });
});

export const queryMstVoucherType = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM mst_vouchertype", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mst_vouchertype",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "mst_vouchertype fetched successfully",
      results,
    });
  });
});

export const queryTrnAccounting = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM trn_accounting", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch trn_accounting",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "trn_accounting fetched successfully",
      results,
    });
  });
});

export const queryTrnBatch = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM trn_batch", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch trn_batch",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "trn_batch fetched successfully",
      results,
    });
  });
});

export const queryTrnBill = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM trn_bill", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch trn_bill",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "trn_bill fetched successfully",
      results,
    });
  });
});

export const queryTrnClosingStockLedger = catchAsyncErrors(
  async (req, res, next) => {
    con.query("SELECT * FROM trn_closingstock_ledger", (err, results) => {
      if (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch trn_closingstock_ledger",
          error: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "trn_closingstock_ledger fetched successfully",
        results,
      });
    });
  }
);

export const queryTrnCostCentre = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM trn_cost_centre", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch trn_cost_centre",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "trn_cost_centre fetched successfully",
      results,
    });
  });
});

export const queryTrnInventory = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM trn_inventory", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch trn_inventory",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "trn_inventory fetched successfully",
      results,
    });
  });
});

export const queryTrnVoucher = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM trn_voucher", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch trn_voucher",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "trn_voucher fetched successfully",
      results,
    });
  });
});
