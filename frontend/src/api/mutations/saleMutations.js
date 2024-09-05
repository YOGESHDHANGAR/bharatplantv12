import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSaleService,
  deleteSaleService,
  updateSaleService,
} from "../services/saleServices";
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

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSaleService,
    onError: (err, newSaleInfo, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: (data, newSaleInfo) => {
      queryClient.invalidateQueries(["sale"]);
      toast.success("Sale created successfully!");
    },
  });
}

export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sale) => updateSaleService(sale._id, sale),
    onError: (err, saleInfo, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["sale"]);
      toast.success("Sale updated successfully!");
    },
  });
}

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSaleService,
    onError: (err, saleId, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sale"]);
      toast.success("Sale deleted successfully!");
    },
  });
};
