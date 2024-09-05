import { validateItem } from "../validation/itemValidation";

// Generalized CREATE action
export const handleCreateItem = async ({
  values,
  table,
  createItemAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateItem(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createItemAsync(values);

  // After creating the item, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the item, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdateItem = async ({
  values,
  table,
  updateItemAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateItem(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updateItemAsync(values);

  // After updating the item, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the item, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeleteItem = (row, deleteItemAsync) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    deleteItemAsync(row.original._id);
  }
};
