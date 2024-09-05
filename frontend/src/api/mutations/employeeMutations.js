import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEmployeeService,
  deleteEmployeeService,
  updateEmployeeService,
} from "../services/employeeServices";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployeeService,

    onError: (err, newEmployeeInfo, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: (data, newEmployeeInfo) => {
      queryClient.invalidateQueries(["employee"]);
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee) => updateEmployeeService(employee._id, employee),
    onError: (err, newEmployeeInfo, rollback) => {},
    onSuccess: (data) => {
      // Handle success if needed
      // Data here is the response from backend after successful update
    },
  });
}

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployeeService,
    onSuccess: () => {
      queryClient.invalidateQueries(["employee"]);
    },
  });
};
