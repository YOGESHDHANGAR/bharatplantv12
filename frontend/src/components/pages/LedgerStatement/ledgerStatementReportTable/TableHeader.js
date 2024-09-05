import React, { useState, useEffect } from "react";
import "./TableHeader.css";
import Joyride from "react-joyride";
import { Box, Stack } from "@mui/material";
import Select from "react-select";
import { useGetAllLedgers } from "../../../../api/queries/ledgerQueries";
import { selectedLedgerAtLedgerStatementSignal } from "../../../../utils/signal/signalUtil";

const LOCAL_STORAGE_KEY = "selectedLedgerForLedgerStatement"; // Define a key for localStorage

const TableHeader = ({ refetch, isError, isFetching, isLoading }) => {
  const {
    data: {
      getAllLedgersResult = [], // Access the sales data array directly
      totalLedgers,
      currentPage,
      totalPages,
    } = {},
  } = useGetAllLedgers({
    queryKey: ["ledger", 0, 10000],
  });

  const ledgerOptions = getAllLedgersResult?.map((ledger) => ({
    value: ledger._id,
    label: ledger.ledgerName,
  }));

  // Read from localStorage or use the default value
  const initialSelectedLedger =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ||
    selectedLedgerAtLedgerStatementSignal?.value ||
    null;

  const [selectedLedger, setSelectedLedger] = useState(initialSelectedLedger);
  // const [selectedLedger, setSelectedLedger] = useState();

  const handleChange = (selectedOption) => {
    setSelectedLedger(selectedOption);
    selectedLedgerAtLedgerStatementSignal.value = selectedOption;

    // Save to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedOption));

    refetch();
  };

  // If no party is selected, run the tour
  const [runTour, setRunTour] = useState(!initialSelectedLedger?.value);

  const steps = [
    {
      target: ".party_name .select__control",
      content: "Please select a party name to view the data.",
      placement: "bottom",
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status, lifecycle } = data;

    if (status === "running" && lifecycle === "tooltip") {
      setTimeout(() => {
        setRunTour(false);
      }, 1500);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        display: "flex",
        p: "8px",
        justifyContent: "space-between",
      })}
    >
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showProgress={false}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
          },
          badge: {
            display: "none", // Hides the step badge (1/1)
          },
        }}
      />

      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Stack
          display="flex"
          flexDirection="row"
          alignItems="center"
          sx={{ width: "450px", height: "25px" }}
        >
          <label>Party_Name:</label>

          <Select
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
            tabIndex={5}
            value={selectedLedger}
            className="party_name"
            classNamePrefix="select"
            isDisabled={isFetching}
            isLoading={isFetching}
            isRtl={false}
            isSearchable={true}
            options={ledgerOptions}
            onChange={handleChange}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default React.memo(TableHeader);
