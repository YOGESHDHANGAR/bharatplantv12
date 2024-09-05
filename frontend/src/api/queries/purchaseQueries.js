import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllPurchaseService } from "../services/purchaseServices";

export const useGetAllPurchases = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllPurchaseService,
    placeholderData: keepPreviousData,
  });
