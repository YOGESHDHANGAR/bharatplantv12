const validateRequired = (value) => !!value.length;

export function validateBankStatement(bankStatement) {
  return {
    // bankStatementName: !validateRequired(bankStatement.bankStatementName) ? "BankStatement Name is Required" : "",
  };
}
