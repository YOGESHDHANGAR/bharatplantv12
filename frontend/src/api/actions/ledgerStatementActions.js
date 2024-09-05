import { validateLedgerStatement } from "../validation/ledgerStatementValidation";

// Generalized CREATE action
export const handleCreateLedgerStatement = async ({
  values,
  table,
  createLedgerStatementAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateLedgerStatement(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createLedgerStatementAsync(values);

  // After creating the ledgerStatementStatement, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the ledgerStatementStatement, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdateLedgerStatement = async ({
  values,
  table,
  updateLedgerStatementAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateLedgerStatement(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updateLedgerStatementAsync(values);

  // After updating the ledgerStatementStatement, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the ledgerStatementStatement, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeleteLedgerStatement = (
  row,
  deleteLedgerStatementAsync
) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    deleteLedgerStatementAsync(row.original._id);
  }
};
