import React, { useEffect } from "react";
import {
  Menu,
  Button,
  Grid,
  FormControl,
  Box,
  Divider,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getDateRange } from "./dateRangeUtils";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { updateDateSignal } from "../solidJs/solid";

const DateRangeFilter = ({ setDateRange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRange, setSelectedRange] = React.useState(() => {
    const storedSelectedRange = localStorage.getItem("selectedRange");
    return storedSelectedRange
      ? JSON.parse(storedSelectedRange)
      : "Select Date Range";
  });

  const { control, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: {
      radioSelectedByUser: localStorage.getItem("radioSelectedByUser")
        ? JSON.parse(localStorage.getItem("radioSelectedByUser"))
        : "this_financial_year",
      customStartDate: localStorage.getItem("customStartDate")
        ? moment(localStorage.getItem("customStartDate"))
        : null,
      customEndDate: localStorage.getItem("customEndDate")
        ? moment(localStorage.getItem("customEndDate"))
        : null,
    },
  });

  const radioSelectedByUser = watch("radioSelectedByUser");
  const customStartDate = watch("customStartDate");
  const customEndDate = watch("customEndDate");

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePredefinedRadioChange = (event) => {
    const selectedRadio = event.target.value;
    setValue("radioSelectedByUser", selectedRadio);
    localStorage.setItem("radioSelectedByUser", JSON.stringify(selectedRadio));

    if (selectedRadio !== "custom") {
      handleSubmit(onSubmit)();
    } else {
      // Reset custom dates when switching to "custom"
      setValue(
        "customStartDate",
        localStorage.getItem("customStartDate")
          ? moment(localStorage.getItem("customStartDate"))
          : null
      );
      setValue(
        "customEndDate",
        localStorage.getItem("customEndDate")
          ? moment(localStorage.getItem("customEndDate"))
          : null
      );
    }
  };

  const handleCustomApplyClick = () => {
    if (
      customStartDate &&
      customEndDate &&
      customEndDate.isAfter(customStartDate)
    ) {
      handleSubmit(onSubmit)();
    } else {
      // Show error message or feedback to the user
      alert(
        "Please select both start and end dates, and ensure the end date is after the start date."
      );
    }
  };

  const onSubmit = () => {
    const { startDate, endDate } = getDateRange(
      getValues("radioSelectedByUser"),
      customStartDate,
      customEndDate
    );

    if (startDate && endDate) {
      // Set the date range in the state
      setDateRange({ startDate, endDate });

      // Save the date range in localStorage
      const dateRange = { startDate, endDate };
      localStorage.setItem("dateRange", JSON.stringify(dateRange));

      // Update the button text with the selected date range
      const rangeText =
        radioSelectedByUser === "all"
          ? "All Records"
          : `${moment(startDate).format("D-MMM-YYYY")} to ${moment(
              endDate
            ).format("D-MMM-YYYY")}`;
      setSelectedRange(rangeText);
      localStorage.setItem("selectedRange", JSON.stringify(rangeText));

      // Update the date signal
      updateDateSignal(dateRange); // Update Solid's dateSignal

      // Close the menu after setting the date range
      handleMenuClose();
    }
  };

  useEffect(() => {
    if (radioSelectedByUser === "custom") {
      setValue(
        "customStartDate",
        localStorage.getItem("customStartDate")
          ? moment(localStorage.getItem("customStartDate"))
          : null
      );
      setValue(
        "customEndDate",
        localStorage.getItem("customEndDate")
          ? moment(localStorage.getItem("customEndDate"))
          : null
      );
    } else {
      handleSubmit(onSubmit)();
    }
  }, [radioSelectedByUser]);

  useEffect(() => {
    if (radioSelectedByUser === "custom" && customStartDate && customEndDate) {
      localStorage.setItem("customStartDate", customStartDate.toISOString());
      localStorage.setItem("customEndDate", customEndDate.toISOString());
    }
  }, [customStartDate, customEndDate, radioSelectedByUser]);

  return (
    <FormControl sx={{ m: 0 }}>
      <Helmet>
        <title>DateRangeFilter</title>
      </Helmet>
      <Tooltip arrow title={selectedRange}>
        <IconButton onClick={handleButtonClick}>
          <CalendarTodayOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        keepMounted
        PaperProps={{
          style: {
            width: "500px",
          },
        }}
      >
        <Box display="flex" sx={{ p: 2, m: 0 }}>
          <Box width="50%" sx={{ m: 0 }}>
            <Typography variant="h6" gutterBottom>
              Date Ranges
            </Typography>
            <Controller
              name="radioSelectedByUser"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} onChange={handlePredefinedRadioChange}>
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="All"
                  />
                  <FormControlLabel
                    value="today"
                    control={<Radio />}
                    label="Today"
                  />
                  <FormControlLabel
                    value="yesterday"
                    control={<Radio />}
                    label="Yesterday"
                  />
                  <FormControlLabel
                    value="1_week"
                    control={<Radio />}
                    label="Last 1 Week"
                  />
                  <FormControlLabel
                    value="1_month"
                    control={<Radio />}
                    label="Last 1 Month"
                  />
                  <FormControlLabel
                    value="this_academic_year"
                    control={<Radio />}
                    label="This Academic Year"
                  />
                  <FormControlLabel
                    value="this_financial_year"
                    control={<Radio />}
                    label="This Financial Year"
                  />
                  <FormControlLabel
                    value="financial_year_2023"
                    control={<Radio />}
                    label="Financial Year 2023"
                  />
                  <FormControlLabel
                    value="financial_year_2022"
                    control={<Radio />}
                    label="Financial Year 2022"
                  />
                  <FormControlLabel
                    value="financial_year_2021"
                    control={<Radio />}
                    label="Financial Year 2021"
                  />
                  <FormControlLabel
                    value="financial_year_2020"
                    control={<Radio />}
                    label="Financial Year 2020"
                  />
                  <FormControlLabel
                    value="custom"
                    control={<Radio />}
                    label="Custom Range"
                  />
                </RadioGroup>
              )}
            />
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box width="50%" pl={2}>
            <Typography variant="h6" gutterBottom>
              Custom Range
            </Typography>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="customStartDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Start Date"
                        renderInput={(params) => <TextField {...params} />}
                        disabled={radioSelectedByUser !== "custom"}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="customEndDate"
                    control={control}
                    rules={{
                      validate: (value) =>
                        !value ||
                        !customStartDate ||
                        moment(value).isAfter(customStartDate) ||
                        "End date must be after start date",
                    }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="End Date"
                        renderInput={(params) => <TextField {...params} />}
                        disabled={radioSelectedByUser !== "custom"}
                      />
                    )}
                  />
                </Grid>
                {radioSelectedByUser === "custom" && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCustomApplyClick}
                    >
                      Apply
                    </Button>
                  </Grid>
                )}
              </Grid>
            </LocalizationProvider>
          </Box>
        </Box>
      </Menu>
    </FormControl>
  );
};

export default DateRangeFilter;
