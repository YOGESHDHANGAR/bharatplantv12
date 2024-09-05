import { validateReceipt } from "../validation/receiptValidation";

// Generalized CREATE action
export const handleCreateReceipt = async ({
  values,
  table,
  createReceiptAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateReceipt(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createReceiptAsync(values);

  // After creating the receipt, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the receipt, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdateReceipt = async ({
  values,
  table,
  updateReceiptAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateReceipt(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updateReceiptAsync(values);

  // After updating the receipt, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the receipt, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeleteReceipt = (row, deleteReceiptAsync) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    deleteReceiptAsync(row.original._id);
  }
};
