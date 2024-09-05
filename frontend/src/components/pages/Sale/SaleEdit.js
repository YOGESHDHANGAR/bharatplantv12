import React, { useCallback, useMemo, useRef, useState } from "react";
import "./SaleEdit.css";
import ItemListTable from "./ItemListTable";
import Select from "react-select";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Helmet } from "react-helmet";
import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { useGetAllLedgers } from "../../../api/queries/ledgerQueries";
import { useGetAllItems } from "../../../api/queries/itemQueries";
import ErrorDisplay from "./ErrorDisplay";
import moment from "moment";
import { useUpdateSale } from "../../../api/mutations/saleMutations";
import { parseAndFormatDate } from "../../../utils/date/parseAndFormatDate";
import { selectCustomStyles } from "../../../utils/customStyles/selectCustomStyles";

let SaleEntryRenderCount = 0;

const SaleEdit = ({ selectedSale }) => {
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
      _id: selectedSale._id || "",
      vchNo: selectedSale.vchNo || "",
      date: selectedSale.date
        ? moment(selectedSale.date).format("DD-MM-YYYY")
        : "",
      ref: selectedSale.ref || "",
      day: selectedSale.day || "",
      partyName: selectedSale.partyName || "",
      item: {
        item: null,
        itemName: "",
        itemQuantity: null,
        itemRate: null,
        itemUnit: "",
        itemTotal: null,
      },
      items: selectedSale.items || [],
      narration: selectedSale.narration || "",
      voucherTotal: selectedSale.voucherTotal || null,
      ledger: {
        value: selectedSale.ledger,
        label: selectedSale.partyName,
      },
    },
    mode: "onChange",
  });

  // Field Array to manage items
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  //call READLedger hook
  const {
    data: {
      getAllLedgersResult: fetchedLedger = [], // Access the sales data array directly
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
    label: ledger.ledgerName,
  }));

  //call READItem hook
  const {
    data: {
      getAllItemsResult: fetchedItem = [], // Access the items data array directly
    } = {},
    isError: isLoadingItemError,
    isFetching: isFetchingItem,
    isLoading: isLoadingItem,
  } = useGetAllItems({
    queryKey: ["item", 0, 10000],
  });

  const itemOptions = fetchedItem?.map((item) => ({
    value: item._id,
    label: item.itemName,
    itemUnit: item.itemUnit,
  }));

  // Call UpdateSale hook
  const { mutateAsync: updateSaleAsync } = useUpdateSale();

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

  // Use useCallback to optimize handleCalculateItemTotal
  const handleCalculateItemTotal = useCallback(() => {
    const itemQuantity = getValues("item.itemQuantity");
    const itemRate = getValues("item.itemRate");
    const itemTotal = itemQuantity * itemRate;

    // Only update if itemTotal has changed
    if (getValues("item.itemTotal") !== itemTotal) {
      setValue("item.itemTotal", itemTotal);
    }
  }, [getValues, setValue]);

  // Function to add item to cartItems
  const handleAddItem = () => {
    if (btnName === "Add") {
      const item = getValues("item.itemName.value");
      const itemName = getValues("item.itemName.label");
      const itemQuantity = getValues("item.itemQuantity");
      const itemRate = getValues("item.itemRate");
      const itemUnit = getValues("item.itemUnit");
      const itemTotal = getValues("item.itemTotal");

      if (!itemName) {
        alert("Please fill all item fields correctly.");
        return;
      }

      const newItem = {
        item,
        itemName,
        itemQuantity,
        itemRate,
        itemUnit,
        itemTotal,
      };

      // Update cart items in the form's state
      append(newItem);

      // Update voucher total by adding the new item's total
      const currentVoucherTotal = getValues("voucherTotal");
      setValue("voucherTotal", currentVoucherTotal + itemTotal);

      // Reset item fields
      setValue("item.itemName", "");
      setValue("item.itemQuantity", null);
      setValue("item.itemRate", null);
      setValue("item.itemUnit", "");
      setValue("item.itemTotal", null);

      setBtnName("Add More");
    } else if (btnName === "Add More") {
      setFocus("item.itemName");
      setBtnName("Add");
    }
  };

  const handleDeleteItem = useCallback(
    (index) => {
      // Remove item from the cartItems array
      const itemToRemove = getValues("items")[index];
      const updatedVoucherTotal =
        getValues("voucherTotal") - itemToRemove.itemTotal;
      setValue("voucherTotal", updatedVoucherTotal);

      remove(index);
    },
    [getValues, remove, setValue]
  );

  // Memoized ItemListTable component to prevent unnecessary re-renders
  const ItemListTableMemo = useMemo(
    () => <ItemListTable rows={fields} onDelete={handleDeleteItem} />,
    [fields, handleDeleteItem]
  );

  // Submit form data including cart items to the API
  const onSubmit = async (formData) => {
    const cartItems = getValues("items");
    if (cartItems.length === 0) {
      alert("Please add at least one item to the cart.");
      return;
    }

    await updateSaleAsync(formData);

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
        className="sale_entry_form"
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
              style={{ textAlign: "right", color: "gray" }}
            />
          </Stack>
        </Stack>

        <Stack
          display="flex"
          flexDirection="row"
          alignItems="center"
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
            <label>Item Name:</label>
            <Controller
              name="item.itemName"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  tabIndex={6}
                  className="item_name"
                  classNamePrefix="select"
                  isDisabled={isFetchingItem}
                  isLoading={isFetchingItem}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  options={itemOptions}
                  styles={selectCustomStyles}
                  onChange={(selectedOption) => {
                    // Call field.onChange to update the form state
                    field.onChange(selectedOption);

                    // Custom handling for setting additional fields
                    if (selectedOption) {
                      setValue("item.itemUnit", selectedOption.itemUnit);
                    } else {
                      setValue("item.itemUnit", "");
                    }
                  }}
                />
              )}
            />
          </Stack>
          <Stack
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Stack display="flex" sx={{ width: "150px", mr: "5px" }}>
              <label>Item Quantity:</label>
              <input
                tabIndex={7}
                name="itemQuantity"
                type="number"
                autoComplete="off"
                {...register("item.itemQuantity", {
                  max: {
                    value: 50000,
                    message: "Quantity cannot exceed 50,000",
                  },
                  valueAsNumber: true,
                  onChange: handleCalculateItemTotal,
                })}
              />
            </Stack>
            <Stack display="flex" sx={{ width: "120px", mr: "5px" }}>
              <label>Item Rate:</label>
              <input
                tabIndex={8}
                name="itemRate"
                type="number"
                autoComplete="off"
                {...register("item.itemRate", {
                  max: {
                    value: 50000,
                    message: "Rate cannot exceed 50,000",
                  },
                  valueAsNumber: true,
                  onChange: handleCalculateItemTotal,
                })}
              />
            </Stack>
            <Stack display="flex" sx={{ width: "100px", mr: "5px" }}>
              <label>Item Unit:</label>
              <input
                tabIndex={9}
                name="itemUnit"
                type="text"
                autoComplete="off"
                {...register("item.itemUnit")}
              />
            </Stack>
            <Stack display="flex" sx={{ width: "180px", mr: "50px" }}>
              <label>Item Total:</label>
              <input
                tabIndex={10}
                name="itemTotal"
                type="number"
                autoComplete="off"
                {...register("item.itemTotal", {
                  valueAsNumber: true,
                })}
              />
            </Stack>
            <Button
              variant="contained"
              onClick={handleAddItem}
              tabIndex={11}
              sx={{ width: "120px", height: "35px", fontSize: "0.9rem" }}
            >
              {btnName}
            </Button>
          </Stack>
        </Stack>
        {ItemListTableMemo}
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
          alignItems="center"
        >
          <LocalPrintshopOutlinedIcon />
          <Stack display="flex" flexDirection="row">
            {/* <Button
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
            </Button> */}
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
              Update
            </Button>
          </Stack>
        </Stack>
        <ErrorDisplay errors={errors} />
      </form>
    </Paper>
  );
};

export default React.memo(SaleEdit);
