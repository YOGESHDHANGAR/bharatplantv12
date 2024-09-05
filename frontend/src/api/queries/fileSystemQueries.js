import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllFilesService } from "../services/fileSystemServices";

export const useGetAllFiles = ({ queryKey }) =>
  useQuery({
    queryKey,
    queryFn: getAllFilesService,
    placeholderData: keepPreviousData,
  });
