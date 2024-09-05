export const handleRestoreItemOfRecycleBin = async (
  row,
  restoreItemOfRecycleBinAsync,
  queryClient
) => {
  const { _id, type } = row.original;

  try {
    // Perform the deletion using the mutation
    await restoreItemOfRecycleBinAsync({ type, _id });
    // Invalidate cache to refetch data
    queryClient.invalidateQueries(["recycleBin"]);
  } catch (error) {
    // Handle error if needed
    console.error("Error restoring recycle bin item:", error);
  }
};

export const handlePermanentlyRecycleBinItem = async (
  row,
  permanentltyDeleteRecycleBinItemAsync,
  queryClient
) => {
  if (window.confirm("Are you sure you want to permanently this item?")) {
    const { _id, type } = row.original;

    try {
      // Perform the deletion using the mutation
      await permanentltyDeleteRecycleBinItemAsync({ type, _id });
      // Invalidate cache to refetch data
      queryClient.invalidateQueries(["recycleBin"]);
    } catch (error) {
      // Handle error if needed
      console.error("Error deleting recycle bin item:", error);
    }
  }
};
