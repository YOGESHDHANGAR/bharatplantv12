import con from "../../databases/mySqlConnection.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";
import Expense from "../../models/expenseModel.js";

// Query and map mst_stock_expense data to create new expenses, skipping duplicates, and capturing failed attempts
export const createExpensesFromData = catchAsyncErrors(
  async (req, res, next) => {
    con.query("SELECT * FROM mst_stock_expense", async (err, results) => {
      if (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch mst_stock_expense",
          error: err.message,
        });
      }

      try {
        const createdExpenses = [];
        const skippedExpenses = [];
        const failedExpenses = [];
        const company = "66cdae838a15473284d761ad"; // Company ID

        // Loop through the results and create expenses if they don't already exist
        for (const expense of results) {
          const { name: expenseName, uom: expenseUnit } = expense;

          try {
            // Check if an expense with the same name, unit, and company already exists
            const existingExpense = await Expense.findOne({
              expenseName,
              expenseUnit,
              company,
            });

            if (!existingExpense) {
              const newExpense = await Expense.create({
                expenseName,
                expenseUnit,
                company,
              });
              createdExpenses.push(newExpense);
            } else {
              // Store skipped expenses
              skippedExpenses.push({ expenseName, expenseUnit, company });
            }
          } catch (error) {
            // Capture the failed expense attempt and the reason for failure
            failedExpenses.push({
              expenseName,
              expenseUnit,
              company,
              error: error.message,
            });
          }
        }

        res.status(201).json({
          success: true,
          message: `Expenses processed successfully`,
          createdCount: createdExpenses.length,
          skippedCount: skippedExpenses.length,
          failedCount: failedExpenses.length,
          createdExpenses,
          skippedExpenses,
          failedExpenses,
        });
      } catch (error) {
        console.error("Error processing expenses:", error.message);
        return res.status(500).json({
          success: false,
          message: "Failed to process expenses",
          error: error.message,
        });
      }
    });
  }
);
