const validateRequired = (value) => !!value.length;

export function validateLedger(ledger) {
  return {
    ledgerName: !validateRequired(ledger.ledgerName)
      ? "Ledger Name is Required"
      : "",
  };
}
