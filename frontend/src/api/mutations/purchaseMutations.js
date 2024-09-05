import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPurchaseService,
  deletePurchaseService,
  updatePurchaseService,
} from "../services/purchaseServices";
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

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchaseService,
    onError: (err, newPurchaseInfo, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: (data, newPurchaseInfo) => {
      queryClient.invalidateQueries(["purchase"]);
      toast.success("Purchase created successfully!");
    },
  });
}

export function useUpdatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (purchase) => updatePurchaseService(purchase._id, purchase),
    onError: (err, purchaseInfo, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["purchase"]);
      toast.success("Purchase updated successfully!");
    },
  });
}

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePurchaseService,
    onError: (err, purchaseId, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["purchase"]);
      toast.success("Purchase deleted successfully!");
    },
  });
};
