import XLSX from "xlsx";

const parseExcel = async (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath); // Read the file from the filesystem
    const sheetName = workbook.SheetNames[0]; // Assuming you want to read the first sheet
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert sheet to JSON

    // Remove the first 12 and last 3 records
    const filteredData = json.slice(12, json.length - 3);

    // Convert filtered data to an array of objects
    const dataObjects = filteredData.map((row) => ({
      date: row[2] || "",
      narration: row[5] || "",
      withdrawal: row[12] || "",
      deposit: row[16] || "",
      balance: row[18] || "",
    }));

    return dataObjects;
  } catch (err) {
    console.error("Error parsing Excel file:", err);
    throw err;
  }
};

export default parseExcel;
