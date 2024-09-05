import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllLedgersService } from "../services/ledgerServices";

export const useGetAllLedgers = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllLedgersService,
    placeholderData: keepPreviousData,
  });
