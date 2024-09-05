import Receipt from "../../models/receiptModel.js";
import moment from "moment";
import ErrorHandler from "../../utils/errorhandler.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";
import Ledger from "../../models/ledgerModel.js";
import con from "../../databases/mySqlConnection.js";

export const createReceiptsFromData = catchAsyncErrors(
  async (req, res, next) => {
    try {
      // Fetch the data from trn_voucher and trn_accounting
      const [trnVoucherResults, trnAccountingResults] = await Promise.all([
        fetchTrnVoucher(),
        fetchTrnAccounting(),
      ]);

      console.log(
        `Fetched ${trnVoucherResults.length} vouchers and ${trnAccountingResults.length} accounting entries`
      );

      const createdReceipts = [];
      const failedReceipts = [];
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

        // Find matching accounting entries for the voucher
        const matchingAccountings = trnAccountingResults.filter(
          (acc) => acc.guid === guid
        );

        if (matchingAccountings.length < 2) {
          failedReceipts.push({
            voucherNumber: vchNo,
            voucherEntry: voucher,
            reason: "Not enough accounting entries found for this voucher",
          });
          continue;
        }

        // Assuming the first matching entry contains the required amount
        const modeAmount = Math.abs(matchingAccountings[0].amount);

        // Get the ledger by partyName
        const dbLedger = await Ledger.findOne({ ledgerName: partyName });

        if (!dbLedger) {
          failedReceipts.push({
            voucherNumber: vchNo,
            voucherEntry: voucher,
            reason: `Ledger not found for partyName ${partyName}`,
          });
          continue;
        }

        // Check if the receipt entry already exists
        const existingReceipt = await Receipt.findOne({
          vchNo,
          date: moment(date).toDate(),
          ref,
          day,
          partyName,
          voucherTotal: Math.abs(modeAmount),
          company: "66cdae838a15473284d761ad",
          ledger: dbLedger._id,
        });

        if (existingReceipt) {
          console.log(`Skipping duplicate receipt entry for voucher ${vchNo}`);
          duplicateCount++;
          continue;
        }

        // Create receipt entry
        const receiptData = {
          vchNo: vchNo || "",
          date: moment(date).toDate() || "",
          ref: ref || "",
          day: day || "",
          partyName: partyName || "",
          modes: [
            {
              modeType: "Cash", // Hardcoded as "Cash"
              modeAmount: modeAmount,
            },
          ],
          narration: narration || "",
          voucherTotal: modeAmount || 0,
          company: "66cdae838a15473284d761ad",
          ledger: dbLedger._id,
        };

        const createReceiptResult = await Receipt.create(receiptData);
        createdReceipts.push(createReceiptResult);
      }

      const successCount = createdReceipts.length;
      const failedCount = failedReceipts.length;

      console.log(`Created ${successCount} receipt entries`);
      console.log(`Failed to create ${failedCount} receipt entries`);
      console.log(`Duplicate entries skipped: ${duplicateCount}`);

      res.status(200).json({
        status: "completed",
        successCount,
        duplicateCount,
        failedCount,
        failedEntries: failedReceipts,
      });
    } catch (error) {
      console.error("Error processing receipts:", error.message);
      res.status(500).json({
        status: "error",
        message: "Failed to process receipts",
        error: error.message,
      });
    }
  }
);

const fetchTrnVoucher = () => {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM trn_voucher WHERE voucher_type="Receipt"`,
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

const fetchTrnAccounting = () => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM trn_accounting`, (err, results) => {
      if (err) {
        console.error("Error fetching trn_accounting:", err.message);
        return reject(err);
      }
      resolve(results);
    });
  });
};
