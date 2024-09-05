// dateSignal.js
import { signal } from "@preact/signals";

export const dateSignal = signal();

export const companySelectedSignal = signal("");

export const companyResultsSignal = signal([]);

export const selectedLedgerAtLedgerStatementSignal = signal(null);
