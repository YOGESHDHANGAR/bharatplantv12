import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllReceiptsService } from "../services/receiptServices";

export const useGetAllReceipts = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllReceiptsService,
    placeholderData: keepPreviousData,
  });
