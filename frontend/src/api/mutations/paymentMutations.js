import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPaymentService,
  deletePaymentService,
  updatePaymentService,
} from "../services/paymentServices";
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

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentService,
    onError: (err, newPaymentInfo, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: (data, newPaymentInfo) => {
      queryClient.invalidateQueries(["payment"]);
      toast.success("Payment created successfully!");
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payment) => updatePaymentService(payment._id, payment),
    onError: (err, paymentInfo, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["payment"]);
      toast.success("Payment updated successfully!");
    },
  });
}

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePaymentService,
    onError: (err, paymentId, rollback) => {
      handleMutationError(err);
      if (rollback) rollback();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["payment"]);
      toast.success("Payment deleted successfully!");
    },
  });
};
