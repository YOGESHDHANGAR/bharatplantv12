import { validatePurchase } from "../validation/purchaseValidation";

// Generalized CREATE action
export const handleCreatePurchase = async ({
  values,
  table,
  createPurchaseAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validatePurchase(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createPurchaseAsync(values);

  // After creating the purchase, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the purchase, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdatePurchase = async ({
  values,
  table,
  updatePurchaseAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validatePurchase(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updatePurchaseAsync(values);

  // After updating the purchase, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the purchase, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeletePurchase = (row, deletePurchaseAsync) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    deletePurchaseAsync(row.original._id);
  }
};
