import { validateExpense } from "../validation/expenseValidation";

// Generalized CREATE action
export const handleCreateExpense = async ({
  values,
  table,
  createExpenseAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateExpense(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createExpenseAsync(values);

  // After creating the expense, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the expense, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdateExpense = async ({
  values,
  table,
  updateExpenseAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateExpense(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updateExpenseAsync(values);

  // After updating the expense, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the expense, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeleteExpense = (row, deleteExpenseAsync) => {
  if (window.confirm("Are you sure you want to delete this expense?")) {
    deleteExpenseAsync(row.original._id);
  }
};
