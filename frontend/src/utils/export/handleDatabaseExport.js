export const handleDatabaseExport = async (refetch) => {
  try {
    // Refetch to get the Blob data
    const fileBlob = await refetch();

    // Generate a timestamp for the filename
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const filename = `db_dump_${timestamp}.archive`;

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(new Blob([fileBlob]));

    // Create an anchor element and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); // Use the timestamped filename
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Optionally, you can also revoke the object URL after a short delay
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Error exporting database:", error);
  }
};
