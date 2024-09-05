import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllCompanysService } from "../services/companyServices";

export const useGetAllCompanys = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllCompanysService,
    placeholderData: keepPreviousData,
  });
