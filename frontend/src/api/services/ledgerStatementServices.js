import apiClient from "../apiClient";

// Service to create a new ledgerStatement
export const createLedgerStatementService = async (ledgerStatement) => {
  const response = await apiClient.post(
    `/ledgerStatement/new`,
    ledgerStatement
  );
  return response.data;
};

// Service to get all ledgerStatements by ledgerId
export const getAllLedgerStatementsService = async ({ queryKey }) => {
  const [
    _,
    pageIndex,
    pageSize,
    dateRange,
    selectedLedgerAtLedgerStatement,
    debouncedGlobalFilter,
  ] = queryKey;

  const fetchURL = new URL(
    "/api/v1/ledgerStatements",
    apiClient.defaults.baseURL
  );

  // Set query parameters for pagination
  fetchURL.searchParams.set("page", `${pageIndex + 1}`); // Page index is 0-based in frontend
  fetchURL.searchParams.set("limit", `${pageSize}`);
  fetchURL.searchParams.set(
    "ledgerId",
    `${selectedLedgerAtLedgerStatement.value}`
  );

  // Stringify the dateRange object and set it as a query parameter
  if (dateRange) {
    fetchURL.searchParams.set("dateRange", JSON.stringify(dateRange));
  }

  if (debouncedGlobalFilter) {
    fetchURL.searchParams.set("debouncedGlobalFilter", debouncedGlobalFilter);
  }

  // Make the API request
  const response = await apiClient.get(fetchURL.toString());

  console.log("response", response.data.getLedgerStatementResult);
  return {
    getLedgerStatementResult: response.data.getLedgerStatementResult,
    totalLedgerStatementRecords: response.data.totalLedgerStatementRecords,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
    vouchersTotalSum: response.data.vouchersTotalSum,
    balance: response.data.balance,
  };
};

// Service to get a single ledgerStatement by ID
export const getSingleLedgerStatementService = async (id) => {
  const response = await apiClient.get(`/ledgerStatement/${id}`);
  return response.data;
};

// Service to update an ledgerStatement by ID
export const updateLedgerStatementService = async (id, ledgerStatement) => {
  const response = await apiClient.put(
    `/ledgerStatement/${id}`,
    ledgerStatement
  );
  return response.data;
};

// Service to soft delete an ledgerStatement by ID
export const deleteLedgerStatementService = async (id) => {
  await apiClient.delete(`/ledgerStatement/${id}/delete`); // Updated for soft-delete if needed
};

// Service to restore a soft-deleted ledgerStatement by ID
export const restoreLedgerStatementService = async (id) => {
  const response = await apiClient.put(`/ledgerStatement/${id}/restore`);
  return response.data;
};

// Service to permanently delete an ledgerStatement by ID
export const permanentDeleteLedgerStatementService = async (id) => {
  await apiClient.delete(`/ledgerStatement/${id}/permanent-delete`);
};
