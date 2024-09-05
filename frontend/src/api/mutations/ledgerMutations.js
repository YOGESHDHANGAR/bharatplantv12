import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLedgerService,
  deleteLedgerService,
  updateLedgerService,
} from "../services/ledgerServices";

export function useCreateLedger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLedgerService,

    onError: (err, newLedgerInfo, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: (data, newLedgerInfo) => {
      queryClient.invalidateQueries(["ledger"]);
    },
  });
}

//UPDATE hook (put ledger in api)
export function useUpdateLedger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ledger) => updateLedgerService(ledger._id, ledger),
    onError: (err, newLedgerInfo, rollback) => {},
    onSuccess: (data) => {
      // Handle success if needed
      // Data here is the response from backend after successful update
    },
  });
}

export const useDeleteLedger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLedgerService,
    onSuccess: () => {
      queryClient.invalidateQueries(["ledger"]);
    },
  });
};
