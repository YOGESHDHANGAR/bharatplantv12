import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllRecycleBinItemsService } from "../services/recycleBinServices";

export const useGetAllRecycleBinItems = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllRecycleBinItemsService,
    placeholderData: keepPreviousData,
  });
