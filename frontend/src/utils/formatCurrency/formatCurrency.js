// utils/formatCurrency.js
export const formatCurrency = (
  value,
  currency = "INR",
  minimumFractionDigits = 0,
  maximumFractionDigits = 2
) => {
  return value?.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });
};
