import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllSalarysService } from "../services/salaryServices";

export const useGetAllSalarys = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllSalarysService,
    placeholderData: keepPreviousData,
  });
