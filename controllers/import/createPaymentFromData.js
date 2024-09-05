import Payment from "../../models/paymentModel.js";
import moment from "moment";
import ErrorHandler from "../../utils/errorhandler.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";
import Ledger from "../../models/ledgerModel.js";
import con from "../../databases/mySqlConnection.js";

export const createPaymentsFromData = catchAsyncErrors(
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

      const createdPayments = [];
      const failedPayments = [];
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
          failedPayments.push({
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
          failedPayments.push({
            voucherNumber: vchNo,
            voucherEntry: voucher,
            reason: `Ledger not found for partyName ${partyName}`,
          });
          continue;
        }

        // Check if the payment entry already exists
        const existingPayment = await Payment.findOne({
          vchNo,
          date: moment(date).toDate(),
          ref,
          day,
          partyName,
          voucherTotal: Math.abs(modeAmount),
          company: "66cdae838a15473284d761ad",
          ledger: dbLedger._id,
        });

        if (existingPayment) {
          console.log(`Skipping duplicate payment entry for voucher ${vchNo}`);
          duplicateCount++;
          continue;
        }

        // Create payment entry
        const paymentData = {
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

        const createPaymentResult = await Payment.create(paymentData);
        createdPayments.push(createPaymentResult);
      }

      const successCount = createdPayments.length;
      const failedCount = failedPayments.length;

      console.log(`Created ${successCount} payment entries`);
      console.log(`Failed to create ${failedCount} payment entries`);
      console.log(`Duplicate entries skipped: ${duplicateCount}`);

      res.status(200).json({
        status: "completed",
        successCount,
        duplicateCount,
        failedCount,
        failedEntries: failedPayments,
      });
    } catch (error) {
      console.error("Error processing payments:", error.message);
      res.status(500).json({
        status: "error",
        message: "Failed to process payments",
        error: error.message,
      });
    }
  }
);

const fetchTrnVoucher = () => {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM trn_voucher WHERE voucher_type="Payment"`,
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
