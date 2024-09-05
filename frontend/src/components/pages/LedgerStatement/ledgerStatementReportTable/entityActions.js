import { validateEntity } from "./entityValidation";

// CREATE action
export const handleCreateEntity = async ({
  values,
  table,
  createEntityAsync,
  setValidationErrors,
  queryClient,
}) => {
  const newValidationErrors = validateEntity(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }

  setValidationErrors({});
  await createEntityAsync(values);

  // After creating the entity, close the modal
  table.setCreatingRow(null); // Close the modal

  // After creating the entity, fetch the updated list of entitys
  queryClient.invalidateQueries(["entitys"]); // Trigger refetch of entitys
};

// UPDATE action
export const handleUpdateEntity = async ({
  values,
  table,
  updateEntityAsync,
  setValidationErrors,
  queryClient,
}) => {
  const newValidationErrors = validateEntity(values);
  if (Object.values(newValidationErrors).some((error) => error)) {
    setValidationErrors(newValidationErrors);
    return;
  }
  setValidationErrors({});
  await updateEntityAsync(values);

  // After updating the entity, close the modal
  table.setEditingRow(null); // Close the modal

  // After updating the entity, fetch the updated list of entitys
  queryClient.invalidateQueries(["entitys"]); // Trigger refetch of entitys
};

export const handleDeleteEntity = async (
  row,
  deleteEntityAsync,
  queryClient
) => {
  if (window.confirm("Are you sure you want to delete this entity?")) {
    await deleteEntityAsync(row.original._id); // Await the async delete operation
    await queryClient.invalidateQueries(["entitys"]); // Trigger refetch of entitys and await it
  }
};
