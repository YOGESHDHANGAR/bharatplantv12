import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { Box } from "@mui/material";
import { useGetAllCompanys } from "../../../api/queries/companyQueries";
import { useUpdateCompany } from "../../../api/mutations/companyMutations"; // Adjust path as needed
import { companySelectedSignal } from "../../../utils/signal/signalUtil";
import { selectCustomStyles } from "../../../utils/customStyles/selectCustomStyles";

const CompanySelect = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100,
  });

  // Use external data if provided, otherwise use useGetAllCompanys
  const {
    data: {
      getAllCompanysResult, // Access the companys data array directly
      totalCompanys,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllCompanys({
    queryKey: ["company", pagination.pageIndex, pagination.pageSize],
  });

  // Memoize companyOptions to prevent unnecessary re-renders
  const companyOptions = useMemo(
    () =>
      getAllCompanysResult?.map((company) => ({
        label: company.companyName,
        value: company._id,
        isOpened: company.isOpened,
      })),
    [getAllCompanysResult]
  );

  // State to control the selected company
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Mutation hook for updating company
  const { mutateAsync: updateCompanyAsync, isPending: isUpdatingCompany } =
    useUpdateCompany();

  useEffect(() => {
    const defaultCompany = companyOptions?.find((company) => company.isOpened);
    companySelectedSignal.value = defaultCompany;
    setSelectedCompany(defaultCompany || null);
  }, [companyOptions]);

  // Handle change in selection
  const handleChange = async (selected) => {
    setSelectedCompany(selected);

    if (selected) {
      try {
        // Only send one request for the selected company
        await updateCompanyAsync({
          id: selected.value,
          isOpened: true, // Set isOpened to true for the selected company
        });
      } catch (error) {
        console.error("Failed to update company:", error);
      }
    }
  };

  return (
    <Box sx={{ width: "300px" }}>
      <Select
        name="company"
        value={selectedCompany} // Control the value with state
        onChange={handleChange} // Handle change
        className="company_name"
        classNamePrefix="select"
        isDisabled={isFetching}
        isLoading={isLoading}
        isRtl={false}
        isSearchable={true}
        options={companyOptions}
        styles={selectCustomStyles}
      />
    </Box>
  );
};

export default CompanySelect;
