const validateRequired = (value) => !!value.length;

export function validateEmployee(employee) {
  return {
    // employeeName: !validateRequired(employee.employeeName)
    //   ? "Employee Name is Required"
    //   : "",
  };
}
