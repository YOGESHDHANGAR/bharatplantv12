import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadFilesService,
  deleteFileService,
  updateFileSystemService,
} from "../services/fileSystemServices";

export function useUploadFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadFilesService,

    onError: (err, newFileSystemInfo, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: (data, newFileSystemInfo) => {
      queryClient.invalidateQueries(["fileSystem"]);
    },
  });
}

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFileService,
    onSuccess: () => {
      queryClient.invalidateQueries(["fileSystem"]);
    },
  });
};
