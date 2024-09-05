import Purchase from "../../models/purchaseModel.js";
import moment from "moment";
import ErrorHandler from "../../utils/errorhandler.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";
import Item from "../../models/itemModel.js";
import Ledger from "../../models/ledgerModel.js";
import con from "../../databases/mySqlConnection.js";

export const createPurchasesFromData = catchAsyncErrors(
  async (req, res, next) => {
    try {
      // Fetch the data from trn_voucher and trn_inventory
      const [trnVoucherResults, trnInventoryResults] = await Promise.all([
        fetchTrnVoucher(),
        fetchTrnInventory(),
      ]);

      console.log(
        `Fetched ${trnVoucherResults.length} vouchers and ${trnInventoryResults.length} inventory items`
      );

      const createdPurchases = [];
      const failedPurchases = [];
      let duplicateCount = 0;

      for (const voucher of trnVoucherResults) {
        const {
          voucher_number: vchNo,
          date,
          reference_number: ref,
          party_name: partyName,
          narration,
          guid,
        } = voucher;

        const day = moment(date).format("dddd");

        // Filter inventory items belonging to the current voucher
        const inventoryItems = trnInventoryResults.filter(
          (item) => item.guid === guid
        );

        if (inventoryItems.length === 0) {
          failedPurchases.push({
            voucherNumber: vchNo,
            voucherEntry: voucher,
            reason: "No inventory items found for this voucher",
          });
          continue;
        }

        const items = [];
        let voucherTotal = 0;

        for (const inventory of inventoryItems) {
          const {
            item: itemName,
            quantity: itemQuantity,
            rate: itemRate,
            amount: itemTotal,
          } = inventory;

          // Convert values to positive if they are negative
          const positiveItemQuantity = Math.abs(itemQuantity);
          const positiveItemRate = Math.abs(itemRate);
          const positiveItemTotal = Math.abs(itemTotal);

          // Get the item from your database by name
          const dbItem = await Item.findOne({ itemName });

          if (dbItem) {
            items.push({
              itemName,
              itemQuantity: positiveItemQuantity,
              itemRate: positiveItemRate,
              itemTotal: positiveItemTotal,
              itemUnit: dbItem.itemUnit,
              item: dbItem._id,
            });

            voucherTotal += positiveItemTotal;
          } else {
            failedPurchases.push({
              voucherNumber: vchNo,
              inventoryEntry: inventory,
              reason: "Item not found in database",
            });
          }
        }

        // Get the ledger by partyName
        const dbLedger = await Ledger.findOne({ ledgerName: partyName });

        // Check if the purchase entry already exists
        const existingPurchase = await Purchase.findOne({
          vchNo,
          date: moment(date).toDate(),
          ref,
          day,
          partyName,
          items: {
            $elemMatch: { itemName: { $in: items.map((i) => i.itemName) } },
          },
          narration,
          voucherTotal,
          company: "66cdae838a15473284d761ad",
          ledger: dbLedger ? dbLedger._id : null,
        });

        if (existingPurchase) {
          console.log(`Skipping duplicate purchase entry for voucher ${vchNo}`);
          duplicateCount++;
          continue;
        }

        if (items.length > 0 && dbLedger) {
          // Create purchase entry
          const createPurchaseResult = await Purchase.create({
            vchNo: vchNo || "",
            date: moment(date).toDate() || "",
            ref: ref || "",
            day: day || "",
            partyName: partyName || "",
            items: items || [],
            narration: narration || "",
            voucherTotal: voucherTotal || 0,
            company: "66cdae838a15473284d761ad",
            ledger: dbLedger._id || null,
          });

          createdPurchases.push(createPurchaseResult);
        } else {
          failedPurchases.push({
            voucherNumber: vchNo,
            voucherEntry: voucher,
            reason: `Ledger not found for partyName ${partyName} or no items processed`,
          });
        }
      }

      const successCount = createdPurchases.length;
      const failedCount = failedPurchases.length;

      console.log(`Created ${successCount} purchases entries`);
      console.log(`Failed to create ${failedCount} purchases entries`);
      console.log(`Duplicate entries skipped: ${duplicateCount}`);

      res.status(200).json({
        status: "completed",
        successCount,
        duplicateCount,
        failedCount,
        failedEntries: failedPurchases,
      });
    } catch (error) {
      console.error("Error processing purchases:", error.message);
      res.status(500).json({
        status: "error",
        message: "Failed to process purchases",
        error: error.message,
      });
    }
  }
);

const fetchTrnVoucher = () => {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM trn_voucher where voucher_type="Purchase"`,
      (err, results) => {
        if (err) {
          console.error("Error fetching trn_voucher:", err.message);
          return reject(err);
        }
        resolve(results);
      }
    );
  });
};

const fetchTrnInventory = () => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM trn_inventory`, (err, results) => {
      if (err) {
        console.error("Error fetching trn_inventory:", err.message);
        return reject(err);
      }
      resolve(results);
    });
  });
};
