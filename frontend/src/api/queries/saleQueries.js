import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllSalesService } from "../services/saleServices";

export const useGetAllSales = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllSalesService,
    placeholderData: keepPreviousData,
  });
