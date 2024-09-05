import moment from "moment";
import { toast } from "sonner";

const dateFormats = [
  "D.M.YY",
  "D.M.YYYY",
  "D-M-YY",
  "D-M-YYYY",
  "M/D/YYYY",
  "DDMMYYYY",
  "YYYYMM",
  "YYYY-MM",
  "M/D",
  "MM/DD",
  "YYYYMMDD",
  "YYYY-MM-DD",
  "YYYY_MM_DD",
  "YYYY.MM.DD",
  "M/D/YY",
  "MM/DD/YY",
  "MM/DD/YYYY",
  "DD MMM YY",
  "DD MMM YYYY",
  "DD MMMM YYYY",
  "MMM D, YY",
  "MMM D, YYYY",
  "MMM DD, YYYY",
  "MMMM D, YYYY",
  "MMMM DD, YYYY",
  "dd MMM D YY",
  "ddd MMM D YY",
  "ddd MMM D YYYY",
  "ddd MMM DD YYYY",
  "dddd, MMM D YYYY",
  "dddd, MMMM D, YYYY",
  "dddd, MMMM DD, YYYY",
  "DD-MM-YYYY",
];

export const parseAndFormatDate = (dateString) => {
  if (!dateString.trim()) {
    toast.error("Date cannot be blank!");
    return null;
  }

  let parsedDate;
  let isValid = false;

  for (const formatString of dateFormats) {
    parsedDate = moment(dateString, formatString, true);

    if (parsedDate.isValid()) {
      isValid = true;
      break;
    }
  }

  if (!isValid) {
    toast.error(`Invalid date format!`);
    return null;
  }

  return {
    formattedDate: parsedDate.format("DD-MM-YYYY"),
    dayOfWeek: parsedDate.format("dddd"),
  };
};
