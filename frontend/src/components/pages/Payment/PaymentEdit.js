import React, { useCallback, useMemo, useRef, useState } from "react";
import "./PaymentEntry.css";
import ModeListTable from "./ModeListTable";
import Select from "react-select";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button, Divider, Paper, Stack } from "@mui/material";
import { useGetAllLedgers } from "../../../api/queries/ledgerQueries";
import ErrorDisplay from "./ErrorDisplay";
import PrintButton from "./PrintButton"; // Adjust the import path as necessary
import {
  useCreatePayment,
  useUpdatePayment,
} from "../../../api/mutations/paymentMutations";
import { parseAndFormatDate } from "../../../utils/date/parseAndFormatDate";
import { selectCustomStyles } from "../../../utils/customStyles/selectCustomStyles";
import moment from "moment";

const PaymentEdit = ({ selectedPayment }) => {
  const [btnName, setBtnName] = useState("Add");

  // Use useForm to manage form state and behavior
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _id: selectedPayment._id || "",
      vchNo: selectedPayment.vchNo || "",
      date: selectedPayment.date
        ? moment(selectedPayment.date).format("DD-MM-YYYY")
        : "",
      ref: selectedPayment.ref || "",
      day: selectedPayment.day || "",
      partyName: selectedPayment.partyName || "",
      mode: {
        mode: null,
        modeType: "",
        modeAmount: null,
      },
      modes: selectedPayment.modes || [],
      narration: selectedPayment.narration || "",
      voucherTotal: selectedPayment.voucherTotal || null,
      ledger: {
        value: selectedPayment.ledger,
        label: selectedPayment.partyName,
      },
    },
    mode: "onChange",
  });

  // Field Array to manage modes
  const { fields, append, remove } = useFieldArray({
    control,
    name: "modes",
  });

  //call READLedger hook
  const {
    data: {
      getAllLedgersResult: fetchedLedger = [], // Access the payments data array directly
      totalLedgers,
      currentPage,
      totalPages,
    } = {},
    isError: isLoadingLedgerError,
    isFetching: isFetchingLedger,
    isLoading: isLoadingLedger,
  } = useGetAllLedgers({
    queryKey: ["ledger", 0, 10000],
  });

  const ledgerOptions = fetchedLedger?.map((ledger) => ({
    value: ledger._id,
    label: ledger.ledgerName, // use ledgerName as the label
  }));

  const modeOptions = [
    {
      label: "Online",
      value: "Online",
    },
    {
      label: "Cash",
      value: "Cash",
    },
  ];
  // Call UpdatePayment hook
  const { mutateAsync: updatePaymentAsync } = useUpdatePayment();

  const handleDateBlur = useCallback(() => {
    const dateInput = getValues("date");
    const result = parseAndFormatDate(dateInput);

    if (result) {
      const { formattedDate, dayOfWeek } = result;
      setValue("date", formattedDate);
      setValue("day", dayOfWeek);
    } else {
      // Handle the case where the date is invalid or blank
      setValue("date", ""); // Clear the date input
      setValue("day", ""); // Clear the day input
    }
  }, [getValues, setValue]);

  // Function to add mode to cartModes
  const handleAddMode = () => {
    if (btnName === "Add") {
      const modeType = getValues("mode.modeType.value");
      const modeAmount = getValues("mode.modeAmount");

      if (!modeType) {
        alert("Please fill all mode fields correctly.");
        return;
      }

      const newMode = {
        modeType,
        modeAmount,
      };

      // Update cart modes in the form's state
      append(newMode);

      // Update voucher total by adding the new mode's total
      const currentVoucherTotal = getValues("voucherTotal");
      setValue("voucherTotal", currentVoucherTotal + modeAmount);

      // Reset mode fields
      setValue("mode.modeType", "");
      setValue("mode.modeAmount", null);

      setBtnName("Add More");
    } else if (btnName === "Add More") {
      setFocus("mode.modeType");
      setBtnName("Add");
    }
  };

  const handleDeleteMode = useCallback(
    (index) => {
      // Remove mode from the cartModes array
      const modeToRemove = getValues("modes")[index];
      const updatedVoucherTotal =
        getValues("voucherTotal") - modeToRemove.modeAmount;
      setValue("voucherTotal", updatedVoucherTotal);

      remove(index);
    },
    [getValues, remove, setValue]
  );

  // Memoized ModeListTable component to prevent unnecessary re-renders
  const ModeListTableMemo = useMemo(
    () => <ModeListTable rows={fields} onDelete={handleDeleteMode} />,
    [fields, handleDeleteMode]
  );

  // Submit form data including cart modes to the API
  const onSubmit = async (formData) => {
    const cartModes = getValues("modes");
    if (cartModes.length === 0) {
      alert("Please add at least one mode to the cart.");
      return;
    }

    await updatePaymentAsync(formData);

    setFocus("vchNo");
    setBtnName("Add");

    // if (handleModelCloseOnSubmit) {
    //   handleModelCloseOnSubmit(); // Close the modal after successful submission
    // }
  };

  return (
    <Paper
      sx={{
        px: 6,
        py: 3,
        border:
          Object.keys(errors).length > 0
            ? "1px solid red"
            : "1px solid transparent", // Apply red border if there are errors
      }}
    >
      <form
        className="payment_entry_form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Stack
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          sx={{ py: 0.2 }}
        >
          <Stack display="flex" flexDirection="row" sx={{ width: "200px" }}>
            <label>Vch_No.:</label>
            <input
              tabIndex={2}
              name="vchNo"
              type="text"
              autoFocus={true}
              autoComplete="off"
              {...register("vchNo", {
                maxLength: {
                  value: 100,
                  message: "Voucher Number cannot exceed 100 characters",
                },
              })}
            />
          </Stack>

          <Stack
            display="flex"
            flexDirection="row"
            sx={{ width: "100px", py: 0.2 }}
          >
            <input
              tabIndex={2}
              name="date"
              type="text" // Changed to text to allow various formats
              {...register("date", {
                required: "Date is required",
              })}
              onBlur={handleDateBlur} // Handle blur event
              style={{
                textAlign: "right",
                border: "1px solid gray",
              }}
              autoComplete="off"
            />
          </Stack>
        </Stack>

        <Stack
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          sx={{ py: 0.2 }}
        >
          <Stack display="flex" flexDirection="row" sx={{ width: "250px" }}>
            <label>Ref:</label>
            <input
              tabIndex={3}
              name="ref"
              type="text"
              autoComplete="off"
              {...register("ref", {
                maxLength: {
                  value: 100,
                  message: "Reference cannot exceed 100 characters",
                },
              })}
            />
          </Stack>
          <Stack display="flex" flexDirection="row" sx={{ width: "100px" }}>
            <input
              tabIndex={4}
              name="day"
              type="text"
              autoComplete="off"
              disabled
              {...register("day", {
                validate: (value) =>
                  [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].includes(value) || "Day must be a valid weekday",
              })}
              style={{
                textAlign: "right",
                color: "gray",
              }}
            />
          </Stack>
        </Stack>

        <Stack
          display="flex"
          flexDirection="row"
          alignModes="center"
          sx={{ width: "450px", height: "25px", py: 3 }}
        >
          <label>Party_Name:</label>
          <Controller
            name="ledger"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                tabIndex={5}
                className="party_name"
                classNamePrefix="select"
                isDisabled={isFetchingLedger}
                isLoading={isFetchingLedger}
                isClearable={true}
                isRtl={false}
                isSearchable={true}
                options={ledgerOptions}
                styles={selectCustomStyles}
              />
            )}
          />
        </Stack>
        <Stack
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          sx={{ mt: 1, mb: 2, py: 0.2 }}
        >
          <Stack display="flex" sx={{ width: "250px", height: "25px" }}>
            <label>Mode Type:</label>
            <Controller
              name="mode.modeType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  tabIndex={6}
                  className="mode_type"
                  classNamePrefix="select"
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  options={modeOptions}
                  styles={selectCustomStyles}
                />
              )}
            />
          </Stack>
          <Stack
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Stack display="flex" sx={{ width: "180px", mr: "50px" }}>
              <label>Mode Amount:</label>
              <input
                tabIndex={10}
                name="modeAmount"
                type="number"
                autoComplete="off"
                {...register("mode.modeAmount", {
                  valueAsNumber: true,
                })}
              />
            </Stack>
            <Button
              variant="contained"
              onClick={handleAddMode}
              tabIndex={11}
              sx={{ width: "120px", height: "35px", fontSize: "0.9rem" }}
            >
              {btnName}
            </Button>
          </Stack>
        </Stack>
        {ModeListTableMemo}
        <Stack
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Stack
            display="flex"
            flexDirection="row"
            sx={{ width: "550px", height: "60px", py: 0.2 }}
          >
            <label>Narration:</label>
            <textarea
              tabIndex={12}
              name="narration"
              {...register("narration", {
                maxLength: {
                  value: 10000,
                  message: "Narration cannot exceed 1000 characters",
                },
              })}
            />
          </Stack>
          <Stack display="flex">
            <label>Voucher Total (₹)</label>
            <input
              tabIndex={13}
              name="voucherTotal"
              type="number"
              disabled // Make it readonly
              {...register("voucherTotal", {
                valueAsNumber: true,
              })}
            />
          </Stack>
        </Stack>
        <Divider sx={{ my: 1 }} />
        <Stack
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignModes="center"
        >
          <PrintButton />
          <Stack display="flex" flexDirection="row">
            <Button
              variant="contained"
              tabIndex={14}
              name="draft"
              sx={{
                width: "80px",
                height: "30px",
                fontSize: "0.9rem",
                ml: "5px",
              }}
            >
              Draft
            </Button>
            <Button
              variant="contained"
              tabIndex={15}
              name="submit"
              type="submit"
              sx={{
                width: "80px",
                height: "30px",
                fontSize: "0.9rem",
                ml: "5px",
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
        <ErrorDisplay errors={errors} />
      </form>
    </Paper>
  );
};

export default React.memo(PaymentEdit);
