import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExpenseService,
  deleteExpenseService,
  updateExpenseService,
} from "../services/expenseServices";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpenseService,

    onError: (err, newExpenseInfo, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: (data, newExpenseInfo) => {
      queryClient.invalidateQueries(["expense"]);
    },
  });
}

//UPDATE hook (put expense in api)
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expense) => updateExpenseService(expense._id, expense),
    onError: (err, newExpenseInfo, rollback) => {},
    onSuccess: (data) => {
      // Handle success if needed
      // Data here is the response from backend after successful update
    },
  });
}

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpenseService,
    onSuccess: () => {
      queryClient.invalidateQueries(["expense"]);
    },
  });
};
