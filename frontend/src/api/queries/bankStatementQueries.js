import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllBankStatementsService } from "../services/bankStatementServices";

export const useGetAllBankStatements = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllBankStatementsService,
    placeholderData: keepPreviousData,
  });
