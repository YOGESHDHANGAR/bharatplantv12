import { validateEmployee } from "../validation/employeeValidation";

// Generalized CREATE action
export const handleCreateEmployee = async ({
  values,
  table,
  createEmployeeAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateEmployee(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createEmployeeAsync(values);

  // After creating the employee, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the employee, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdateEmployee = async ({
  values,
  table,
  updateEmployeeAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateEmployee(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updateEmployeeAsync(values);

  // After updating the employee, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the employee, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeleteEmployee = (row, deleteEmployeeAsync) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    deleteEmployeeAsync(row.original._id);
  }
};
