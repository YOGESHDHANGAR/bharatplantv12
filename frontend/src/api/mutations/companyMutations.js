import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompanyService,
  deleteCompanyService,
  updateCompanyService,
} from "../services/companyServices";

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompanyService,

    onError: (err, newCompanyInfo, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: (data, newCompanyInfo) => {
      queryClient.invalidateQueries(["company"]);
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (company) => updateCompanyService(company.id, company),
    onError: (err, newCompanyInfo, rollback) => {},
    onSuccess: (data) => {
      // Handle success if needed
      // Data here is the response from backend after successful update
    },
  });
}

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCompanyService,
    onSuccess: () => {
      queryClient.invalidateQueries(["company"]);
    },
  });
};
