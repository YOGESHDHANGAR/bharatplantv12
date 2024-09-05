import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllExpensesService } from "../services/expenseServices";

export const useGetAllExpenses = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllExpensesService,
    placeholderData: keepPreviousData,
  });
