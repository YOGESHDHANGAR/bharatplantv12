import { validateSalary } from "../validation/salaryValidation";

// Generalized CREATE action
export const handleCreateSalary = async ({ formData, createSalaryAsync }) => {
  // const newValidationErrors = validateSalary(values);
  // if (Object.values(newValidationErrors).some((error) => error)) {
  //   setValidationErrors(newValidationErrors);
  //   return;
  // }

  // setValidationErrors({});
  await createSalaryAsync(formData);

  // After creating the salary, close the modal
  // table.setCreatingRow(null); // Close the modal

  // After creating the salary, fetch the updated list of entities
  // queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdateSalary = async ({
  values,
  table,
  updateSalaryAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateSalary(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updateSalaryAsync(values);

  // After updating the salary, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the salary, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeleteSalary = (row, deleteSalaryAsync) => {
  if (window.confirm("Are you sure you want to delete this salary?")) {
    deleteSalaryAsync(row.original._id);
  }
};
