const validateRequired = (value) => !!value.length;

export function validateLedgerStatement(ledgerStatement) {
  return {
    // ledgerStatementName: !validateRequired(ledgerStatement.ledgerStatementName)
    //   ? "Ledger Name is Required"
    //   : "",
  };
}
