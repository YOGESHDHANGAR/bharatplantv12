import { validateFileSystem } from "../validation/fileSystemValidation";

// Generalized CREATE action
export const handleUploadFiles = async ({
  values,
  table,
  uploadFilesAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateFileSystem(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await uploadFilesAsync(values);

  // After creating the fileSystem, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the fileSystem, fetch the updated list of entities
  queryClient.invalidateQueries("fileSystem"); // Trigger refetch of entities
};

// Generalized DELETE action
export const handlePermanentlyDeleteFiles = (row, deleteFileSystemAsync) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    console.log("row", row.original);
    deleteFileSystemAsync(row.original._id);
  }
};
