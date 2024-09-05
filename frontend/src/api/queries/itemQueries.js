import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllItemsService } from "../services/itemServices";

export const useGetAllItems = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllItemsService,
    placeholderData: keepPreviousData,
  });
