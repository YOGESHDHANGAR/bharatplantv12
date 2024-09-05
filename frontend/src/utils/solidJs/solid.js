// dateSignal.js
import { createSignal } from "solid-js";

const [dateSignal, setDateSignal] = createSignal(
  JSON.parse(localStorage.getItem("dateRange")) || [null, null]
);

const updateDateSignal = (newDateRange) => {
  setDateSignal(newDateRange);
  localStorage.setItem("dateRange", JSON.stringify(newDateRange));
};

export { dateSignal, updateDateSignal };
