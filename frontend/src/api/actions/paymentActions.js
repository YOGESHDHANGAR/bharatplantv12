import { validatePayment } from "../validation/paymentValidation";

// Generalized CREATE action
export const handleCreatePayment = async ({
  values,
  table,
  createPaymentAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validatePayment(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createPaymentAsync(values);

  // After creating the payment, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the payment, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdatePayment = async ({
  values,
  table,
  updatePaymentAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validatePayment(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updatePaymentAsync(values);

  // After updating the payment, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the payment, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeletePayment = (row, deletePaymentAsync) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    deletePaymentAsync(row.original._id);
  }
};
