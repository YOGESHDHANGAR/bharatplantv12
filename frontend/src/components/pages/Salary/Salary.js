import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Box, Typography, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SalaryReportTable from "./saleryReport/SalaryReportTable";
import { useGetAllEmployees } from "../../../api/queries/employeeQueries";
import EmployeeModal from "./EmployeeModal";
import { useGetAllSalarys } from "../../../api/queries/salaryQueries";

const generateMonthOptions = () => {
  const months = [];
  const startDate = new Date();
  const currentYear = startDate.getFullYear();

  // Financial year starts from April of the current year
  startDate.setMonth(3); // April (month index starts at 0)
  startDate.setFullYear(currentYear);

  // If the current month is before April, adjust the year
  if (new Date().getMonth() < 3) {
    startDate.setFullYear(currentYear - 1);
  }

  // Generate months from April of the current financial year to March of the next year
  for (let i = 0; i < 12; i++) {
    const month = startDate.toLocaleString("default", { month: "short" });
    const year = startDate.getFullYear();
    months.push({
      label: `${month} ${year}`,
      value: `${month} ${year}`,
    });
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return months;
};

const LOCAL_STORAGE_KEY = "selectedEmployee";

const Salary = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const { data: { getAllEmployeesResult = [], totalEmployees } = {} } =
    useGetAllEmployees({
      queryKey: ["employee", 0, 10000],
    });

  const employeeOptions = getAllEmployeesResult?.map((employee) => ({
    value: employee._id,
    label: employee.employeeName,
  }));

  // Use external data if provided, otherwise use useGetAllSalarys
  const {
    data: {
      getAllSalarysResult, // Access the salarys data array directly
      totalSalarys,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllSalarys({
    queryKey: ["salary"],
  });

  const monthOptions = generateMonthOptions();

  // Set current month as default selection
  useEffect(() => {
    const currentMonth = new Date();
    const monthName = currentMonth.toLocaleString("default", {
      month: "short",
    });
    const year = currentMonth.getFullYear();

    // Adjust the year for financial year start
    if (currentMonth.getMonth() < 3) {
      setSelectedMonth({
        label: `${monthName} ${year - 1}`,
        value: `${monthName} ${year - 1}`,
      });
    } else {
      setSelectedMonth({
        label: `${monthName} ${year}`,
        value: `${monthName} ${year}`,
      });
    }
  }, []);

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
    setEditingEmployee(null);
  };

  const handleSaveEmployee = (data) => {
    if (isEditMode && editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp === editingEmployee ? data.selectedEmployee.label : emp
        )
      );
      setSelectedEmployee(data.selectedEmployee);
    } else if (data.selectedEmployee) {
      setEmployees((prev) => [...prev, data.selectedEmployee.label]);
      setSelectedEmployee(data.selectedEmployee);
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
            options={monthOptions}
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
            getAllSalarysResult={getAllSalarysResult}
            totalSalarys={totalSalarys}
            currentPage={currentPage}
            totalPages={totalPages}
            refetch={refetch}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
            employee={selectedEmployee}
            month={selectedMonth?.value}
          />
        </Box>
      </Box>

      <EmployeeModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        employeeOptions={employeeOptions}
        selectedEmployee={selectedEmployee}
        isEditMode={isEditMode}
      />
    </Box>
  );
};

export default Salary;
