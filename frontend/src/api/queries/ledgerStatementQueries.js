import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllLedgerStatementsService } from "../services/ledgerStatementServices";

export const useGetAllLedgerStatements = ({ queryKey }) => {
  const [
    _,
    __,
    ___,
    dateRange,
    selectedLedgerAtLedgerStatement,
    debouncedGlobalFilter,
  ] = queryKey;

  const isLedgerValid = Boolean(
    selectedLedgerAtLedgerStatement &&
      typeof selectedLedgerAtLedgerStatement === "object" &&
      "value" in selectedLedgerAtLedgerStatement &&
      "label" in selectedLedgerAtLedgerStatement
  );

  return useQuery({
    queryKey,
    queryFn: getAllLedgerStatementsService,
    enabled: isLedgerValid,
    placeholderData: keepPreviousData,
  });
};
