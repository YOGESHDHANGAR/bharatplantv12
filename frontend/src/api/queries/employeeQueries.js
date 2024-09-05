import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllEmployeesService } from "../services/employeeServices";

export const useGetAllEmployees = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllEmployeesService,
    placeholderData: keepPreviousData,
  });
