import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Box,
  Typography,
  Button,
  Modal,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SalaryReportTable from "./saleryReport/SalaryReportTable";
import { useGetAllEmployees } from "../../../api/queries/employeeQueries";

const months = [
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];

const LOCAL_STORAGE_KEY = "selectedEmployee";

const Salary = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNewEmployee, setSelectedNewEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [workingDayOption, setWorkingDayOption] = useState("Full Month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salaryPerMonth, setSalaryPerMonth] = useState(""); // New state for salary

  const {
    data: {
      getAllEmployeesResult = [],
      totalEmployees,
      currentPage,
      totalPages,
    } = {},
  } = useGetAllEmployees({
    queryKey: ["employee", 0, 10000],
  });

  const employeeOptions = getAllEmployeesResult?.map((employee) => ({
    value: employee._id,
    label: employee.employeeName,
  }));

  useEffect(() => {
    const savedEmployee = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (savedEmployee) {
      setSelectedEmployee(savedEmployee);
    }
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedEmployee));
    }
  }, [selectedEmployee]);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleMonthChange = (selected) => {
    setSelectedMonth(selected);
  };

  const handleAddEmployee = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNewEmployee(null);
    setEditingEmployee(null);
    setWorkingDayOption("Full Month");
    setStartDate("");
    setEndDate("");
    setSalaryPerMonth(""); // Clear the salary field
  };

  const handleSaveEmployee = () => {
    // Save logic here
    if (isEditMode && editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp === editingEmployee ? selectedNewEmployee.label : emp
        )
      );
      setSelectedEmployee(selectedNewEmployee.label);
    } else if (selectedNewEmployee) {
      setEmployees((prev) => [...prev, selectedNewEmployee.label]);
      setSelectedEmployee(selectedNewEmployee.label);
    }
    handleCloseModal();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex">
        <Box
          sx={{
            width: "220px",
            mr: 2,
            p: 1,
            borderRadius: 1,
            boxShadow: 4,
            backgroundColor: "white",
          }}
        >
          <Select
            name="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            options={months}
            isSearchable={false}
          />
          <Box mt={2}>
            {employees.map((employee, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <Typography
                  onClick={() => handleEmployeeClick(employee)}
                  sx={{
                    cursor: "pointer",
                    fontSize: "16px",
                    color: selectedEmployee === employee ? "white" : "black",
                    backgroundColor:
                      selectedEmployee === employee ? "#7695FF" : "transparent",
                    p: 1,
                    borderRadius: 1,
                    flexGrow: 1,
                    "&:hover": {
                      backgroundColor: "lightblue",
                    },
                  }}
                >
                  {employee}
                </Typography>
                <IconButton
                  onClick={() => handleEditEmployee(employee)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <EditIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
          <Box
            mt={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              onClick={handleAddEmployee}
              sx={{ width: "100%", borderRadius: 5 }}
            >
              + Add
            </Button>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SalaryReportTable
            employee={selectedEmployee}
            month={selectedMonth?.value}
          />
        </Box>
      </Box>

      {/* Modal for adding or editing an employee */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
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
          <Select
            value={selectedNewEmployee}
            onChange={setSelectedNewEmployee}
            options={employeeOptions}
            isSearchable={true}
          />
          <Box mt={3}>
            <TextField
              label="Salary per Month"
              type="number"
              value={salaryPerMonth}
              onChange={(e) => setSalaryPerMonth(e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Box>
          <Box mt={3}>
            <Typography variant="subtitle1">Working Days</Typography>
            <RadioGroup
              value={workingDayOption}
              onChange={(e) => setWorkingDayOption(e.target.value)}
              row
            >
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
            {workingDayOption === "Custom Dates" && (
              <Box mt={2}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </Box>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveEmployee}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Salary;
