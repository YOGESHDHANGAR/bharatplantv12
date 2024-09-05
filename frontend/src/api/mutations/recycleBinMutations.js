import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  permanentDeleteRecycleBinService,
  restoreItemofRecycleBinService,
} from "../services/recycleBinServices";

// Hook to permanently delete an item
export function useRestoreItemOfRecycleBin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, _id }) => restoreItemofRecycleBinService(type, _id),
    onError: (err, { type, _id }, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["recycleBin"]);
    },
  });
}

// Hook to permanently delete an item
export function usePermanentDeleteRecycleBin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, _id }) => permanentDeleteRecycleBinService(type, _id),
    onError: (err, { type, _id }, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["recycleBin"]);
    },
  });
}
