import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllPaymentsService } from "../services/paymentServices";

export const useGetAllPayments = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllPaymentsService,
    placeholderData: keepPreviousData,
  });
