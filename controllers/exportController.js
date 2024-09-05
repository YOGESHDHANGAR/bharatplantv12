import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const createDatabaseExport = catchAsyncErrors(async (req, res, next) => {
  const dumpFilePath = path.join(__dirname, "db_dump.archive");

  const dumpCommand = `mongodump --db bharatplantv1 --archive=${dumpFilePath} --gzip`;

  exec(dumpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating database dump: ${error}`);
      return res.status(500).json({ message: "Failed to export database" });
    }

    res.download(dumpFilePath, "db_dump.archive", (err) => {
      if (err) {
        console.error(`Error downloading the file: ${err}`);
        return res.status(500).json({ message: "Failed to download file" });
      } else {
        fs.unlinkSync(dumpFilePath); // Clean up the file after download
      }
    });
  });
});
