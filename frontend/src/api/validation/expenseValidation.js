const validateRequired = (value) => !!value.length;

export function validateExpense(expense) {
  return {
    // expenseName: !validateRequired(expense.expenseName) ? "Expense Name is Required" : "",
  };
}
