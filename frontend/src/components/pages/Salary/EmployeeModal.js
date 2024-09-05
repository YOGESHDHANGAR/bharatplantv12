import React from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { handleCreateSalary } from "../../../api/actions/salaryActions";
import { useCreateSalary } from "../../../api/mutations/salaryMutations";
import { useGetAllSalarys } from "../../../api/queries/salaryQueries";

const EmployeeModal = ({
  open,
  onClose,
  onSave,
  employeeOptions,
  selectedEmployee,
  isEditMode,
}) => {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      selectedEmployee: selectedEmployee
        ? { value: selectedEmployee._id, label: selectedEmployee.employeeName }
        : null,
      salaryPerMonth: "",
      workingDayOption: "Full Month",
      startDate: "",
      endDate: "",
      paidRecords: [],
    },
  });

  const { mutateAsync: createSalaryAsync } = useCreateSalary();

  // Watch the workingDayOption field
  const workingDayOption = watch("workingDayOption");

  // Update form values when selectedEmployee changes
  React.useEffect(() => {
    if (selectedEmployee) {
      setValue("selectedEmployee", {
        value: selectedEmployee._id,
        label: selectedEmployee.employeeName,
      });
    }
  }, [selectedEmployee, setValue]);

  const onSubmit = (formData) => {
    console.log(formData);
    handleCreateSalary({ formData, createSalaryAsync });
    onSave(formData);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-employee-modal"
      aria-describedby="add-employee-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography id="add-employee-modal" variant="h6" component="h2">
          {isEditMode ? "Edit Employee" : "Add New Employee"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="selectedEmployee"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={employeeOptions}
                isSearchable={true}
                onChange={(selected) => setValue("selectedEmployee", selected)}
                menuPortalTarget={document.body} // Render dropdown in the body
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }} // Adjust zIndex
              />
            )}
          />
          <Box mt={3}>
            <Controller
              name="salaryPerMonth"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Salary per Month"
                  type="number"
                  {...field}
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              )}
            />
          </Box>
          <Box mt={3}>
            <Typography variant="subtitle1">Working Days</Typography>
            <Controller
              name="workingDayOption"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="Full Month"
                    control={<Radio />}
                    label="Full Month"
                  />
                  <FormControlLabel
                    value="Custom Dates"
                    control={<Radio />}
                    label="Custom Dates"
                  />
                </RadioGroup>
              )}
            />
            {workingDayOption === "Custom Dates" && (
              <Box mt={2}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Start Date"
                      type="date"
                      {...field}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="End Date"
                      type="date"
                      {...field}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ mt: 2 }}
                    />
                  )}
                />
              </Box>
            )}
          </Box>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={onClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EmployeeModal;
