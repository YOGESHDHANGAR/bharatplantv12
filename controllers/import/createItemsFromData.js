import con from "../../databases/mySqlConnection.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";
import Item from "../../models/itemModel.js";

// Query and map mst_stock_item data to create new items, skipping duplicates, and capturing failed attempts
export const createItemsFromData = catchAsyncErrors(async (req, res, next) => {
  con.query("SELECT * FROM mst_stock_item", async (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mst_stock_item",
        error: err.message,
      });
    }

    try {
      const createdItems = [];
      const skippedItems = [];
      const failedItems = [];
      const company = "66cdae838a15473284d761ad"; // Company ID

      // Loop through the results and create items if they don't already exist
      for (const item of results) {
        const { name: itemName, uom: itemUnit } = item;

        try {
          // Check if an item with the same name, unit, and company already exists
          const existingItem = await Item.findOne({
            itemName,
            itemUnit,
            company,
          });

          if (!existingItem) {
            const newItem = await Item.create({
              itemName,
              itemUnit,
              company,
            });
            createdItems.push(newItem);
          } else {
            // Store skipped items
            skippedItems.push({ itemName, itemUnit, company });
          }
        } catch (error) {
          // Capture the failed item attempt and the reason for failure
          failedItems.push({
            itemName,
            itemUnit,
            company,
            error: error.message,
          });
        }
      }

      res.status(201).json({
        success: true,
        message: `Items processed successfully`,
        createdCount: createdItems.length,
        skippedCount: skippedItems.length,
        failedCount: failedItems.length,
        createdItems,
        skippedItems,
        failedItems,
      });
    } catch (error) {
      console.error("Error processing items:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to process items",
        error: error.message,
      });
    }
  });
});
