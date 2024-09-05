import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDatabaseExportService } from "../services/exportService";

export const useGetDatabaseExport = () =>
  useQuery({
    queryFn: getDatabaseExportService,
    placeholderData: keepPreviousData,
    enabled: false,
  });
