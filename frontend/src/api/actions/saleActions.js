import { validateSale } from "../validation/saleValidation";

// Generalized CREATE action
export const handleCreateSale = async ({
  values,
  table,
  createSaleAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateSale(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createSaleAsync(values);

  // After creating the sale, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the sale, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdateSale = async ({
  values,
  table,
  updateSaleAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateSale(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updateSaleAsync(values);

  // After updating the sale, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the sale, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeleteSale = (row, deleteSaleAsync) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    deleteSaleAsync(row.original._id);
  }
};
