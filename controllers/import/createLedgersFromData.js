import con from "../../databases/mySqlConnection.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";
import Ledger from "../../models/ledgerModel.js";

// Query and map mst_ledger data to create new ledgers, skipping duplicates, and capturing failed attempts
export const createLedgersFromData = catchAsyncErrors(
  async (req, res, next) => {
    con.query("SELECT * FROM mst_ledger", async (err, results) => {
      if (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch mst_ledger",
          error: err.message,
        });
      }

      try {
        const createdLedgers = [];
        const skippedLedgers = [];
        const failedLedgers = [];
        const company = "66cdae838a15473284d761ad"; // Company ID

        // Loop through the results and create ledgers if they don't already exist
        for (const ledger of results) {
          const { name: ledgerName, parent: ledgerType } = ledger;

          try {
            // Check if a ledger with the same name, type, and company already exists
            const existingLedger = await Ledger.findOne({
              ledgerName,
              ledgerType,
              company,
            });

            if (!existingLedger) {
              const newLedger = await Ledger.create({
                ledgerName,
                ledgerType,
                company,
              });
              createdLedgers.push(newLedger);
            } else {
              // Store skipped ledgers
              skippedLedgers.push({ ledgerName, ledgerType, company });
            }
          } catch (error) {
            // Capture the failed ledger attempt and the reason for failure
            failedLedgers.push({
              ledgerName,
              ledgerType,
              company,
              error: error.message,
            });
          }
        }

        res.status(201).json({
          success: true,
          message: `Ledgers processed successfully, skipped ${skippedLedgers.length} duplicates, with ${failedLedgers.length} failures`,
          createdLedgers,
          skippedLedgers,
          failedLedgers,
        });
      } catch (error) {
        console.error("Error processing ledgers:", error.message);
        return res.status(500).json({
          success: false,
          message: "Failed to process ledgers",
          error: error.message,
        });
      }
    });
  }
);
