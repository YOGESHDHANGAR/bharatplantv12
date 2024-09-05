import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSalaryService,
  deleteSalaryService,
  updateSalaryService,
} from "../services/salaryServices";

export function useCreateSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSalaryService,

    onError: (err, newSalaryInfo, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: (data, newSalaryInfo) => {
      queryClient.invalidateQueries(["salary"]);
    },
  });
}

//UPDATE hook (put salary in api)
export function useUpdateSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (salary) => updateSalaryService(salary._id, salary),
    onError: (err, newSalaryInfo, rollback) => {},
    onSuccess: (data) => {
      // Handle success if needed
      // Data here is the response from backend after successful update
    },
  });
}

export const useDeleteSalary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSalaryService,
    onSuccess: () => {
      queryClient.invalidateQueries(["salary"]);
    },
  });
};
