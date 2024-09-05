import { validateBankStatement } from "../validation/bankStatementValidation";

// Generalized CREATE action
// Generalized CREATE action for multiple records
export const handleCreateBankStatement = async ({
  records,
  createBankStatementsAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = records.flatMap(validateBankStatement);
  if (newValidationErrors.some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createBankStatementsAsync(records);

  // After creating the bank statements, close the modal
  // Note: Adjust according to how you close your modal
  // table.setCreatingRow(null);

  // After creating the bank statements, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdateBankStatement = async ({
  values,
  table,
  updateBankStatementAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateBankStatement(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updateBankStatementAsync(values);

  // After updating the bankStatement, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the bankStatement, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeleteBankStatement = (row, deleteBankStatementAsync) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    deleteBankStatementAsync(row.original._id);
  }
};
