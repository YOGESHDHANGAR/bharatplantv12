import { validateCompany } from "../validation/companyValidation";

// Generalized CREATE action
export const handleCreateCompany = async ({
  values,
  table,
  createCompanyAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateCompany(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createCompanyAsync(values);

  // After creating the company, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the company, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized UPDATE action
export const handleUpdateCompany = async ({
  values,
  table,
  updateCompanyAsync,
  setValidationErrors,
  queryClient,
  queryKey,
}) => {
  const newValidationErrors = validateCompany(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await updateCompanyAsync(values);

  // After updating the company, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the company, fetch the updated list of entities
  queryClient.invalidateQueries(queryKey); // Trigger refetch of entities
};

// Generalized DELETE action
export const handleDeleteCompany = (row, deleteCompanyAsync) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    deleteCompanyAsync(row.original._id);
  }
};
