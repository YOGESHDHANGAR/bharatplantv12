import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBankStatementService,
  deleteBankStatementService,
  updateBankStatementService,
  uploadBankStatementFileService,
} from "../services/bankStatementServices";

export function useUploadBankStatementFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadBankStatementFileService,

    onError: (err, newBankStatementInfo, rollback) => {
      // Handle error and rollback cache if needed
      console.error("Error uploading file:", err);
      // rollback(); // Uncomment if you have rollback logic
    },
    onSuccess: (data, newBankStatementInfo) => {
      // Invalidate the query to refetch the updated bank statements
      queryClient.invalidateQueries(["bankStatement"]);
    },
  });
}

export function useCreateBankStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBankStatementService,

    onError: (err, newBankStatementInfo, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: (data, newBankStatementInfo) => {
      queryClient.invalidateQueries(["bankStatement"]);
    },
  });
}

export function useUpdateBankStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bankStatement) =>
      updateBankStatementService(bankStatement._id, bankStatement),
    onError: (err, newBankStatementInfo, rollback) => {},
    onSuccess: (data) => {
      // Handle success if needed
      // Data here is the response from backend after successful update
    },
  });
}

export const useDeleteBankStatement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBankStatementService,
    onSuccess: () => {
      queryClient.invalidateQueries(["bankStatement"]);
    },
  });
};
