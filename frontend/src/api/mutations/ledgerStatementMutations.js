import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLedgerStatementService,
  deleteLedgerStatementService,
  updateLedgerStatementService,
} from "../services/ledgerStatementServices";

export function useCreateLedgerStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLedgerStatementService,

    onError: (err, newLedgerStatementInfo, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: (data, newLedgerStatementInfo) => {
      queryClient.invalidateQueries(["ledgerStatement"]);
    },
  });
}

//UPDATE hook (put ledgerStatement in api)
export function useUpdateLedgerStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ledgerStatement) =>
      updateLedgerStatementService(ledgerStatement._id, ledgerStatement),
    onError: (err, newLedgerStatementInfo, rollback) => {},
    onSuccess: (data) => {
      // Handle success if needed
      // Data here is the response from backend after successful update
    },
  });
}

export const useDeleteLedgerStatement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLedgerStatementService,
    onSuccess: () => {
      queryClient.invalidateQueries(["ledgerStatement"]);
    },
  });
};
