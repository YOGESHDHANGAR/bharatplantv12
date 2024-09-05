import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReceiptService,
  deleteReceiptService,
  updateReceiptService,
} from "../services/receiptServices";
import { toast } from "sonner";

const handleMutationError = (err) => {
  if (err.response) {
    const { status, statusText } = err.response;
    const errorMessage = err.message || "An error occurred";
    switch (status) {
      case 400:
        toast.error(`Bad request: ${statusText || errorMessage}`);
        break;
      case 401:
        toast.error(`Unauthorized: ${statusText || errorMessage}`);
        break;
      case 403:
        toast.error(`Forbidden: ${statusText || errorMessage}`);
        break;
      case 404:
        toast.error(`Not found: ${statusText || errorMessage}`);
        break;
      case 500:
        toast.error(`Server error: ${statusText || errorMessage}`);
        break;
      default:
        toast.error(`Error ${status}: ${statusText || errorMessage}`);
    }
  } else {
    toast.error(`Network error: ${err.message}`);
  }
};

export function useCreateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReceiptService,
    onError: (err, newReceiptInfo, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: (data, newReceiptInfo) => {
      queryClient.invalidateQueries(["receipt"]);
      toast.success("Receipt created successfully!");
    },
  });
}

export function useUpdateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receipt) => updateReceiptService(receipt._id, receipt),
    onError: (err, receiptInfo, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["receipt"]);
      toast.success("Receipt updated successfully!");
    },
  });
}

export const useDeleteReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReceiptService,
    onError: (err, receiptId, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["receipt"]);
      toast.success("Receipt deleted successfully!");
    },
  });
};
