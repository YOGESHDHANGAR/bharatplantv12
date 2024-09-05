import { validateLedger } from "../validation/ledgerValidation";

// Generalized CREATE action
export const handleCreateLedger = async ({
  values,
  table,
  createLedgerAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateLedger(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createLedgerAsync(values);

  // After creating the ledger, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the ledger, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdateLedger = async ({
  values,
  table,
  updateLedgerAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateLedger(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updateLedgerAsync(values);

  // After updating the ledger, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the ledger, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeleteLedger = (row, deleteLedgerAsync) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    deleteLedgerAsync(row.original._id);
  }
};
