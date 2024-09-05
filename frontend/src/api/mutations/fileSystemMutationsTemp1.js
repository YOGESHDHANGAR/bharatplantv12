import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  uploadFilesService,
  deleteFilesService,
} from "../services/fileSystemService";

// Hook for uploading a file
export function useGetUploadFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadFilesService,
    onError: (err, file, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: (data) => {
      // Handle success if needed
      // Invalidate the query to refresh the list of files
      queryClient.invalidateQueries(["uploadedFiles"]);
    },
  });
}

// Hook for deleting a file
export function useGetDeleteFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFilesService,
    onError: (err, fileId, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: () => {
      // Invalidate the query to refresh the list of files
      queryClient.invalidateQueries(["uploadedFiles"]);
    },
  });
}
