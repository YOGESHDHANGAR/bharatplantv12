// Example of useDateFilteredData
import moment from "moment";
import { useMemo } from "react";

export const useDateFilteredData = (
  data,
  dateRange,
  dateFieldName = "date"
) => {
  return useMemo(() => {
    if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
      return data; // No filtering needed
    }

    const startDate = moment(dateRange.startDate).startOf("day");
    const endDate = moment(dateRange.endDate).endOf("day");

    return data.filter((item) => {
      const itemDate = moment(item[dateFieldName], "YYYY-MM-DD");
      return (
        (!startDate || itemDate.isSameOrAfter(startDate, "day")) &&
        (!endDate || itemDate.isSameOrBefore(endDate, "day"))
      );
    });
  }, [data, dateRange, dateFieldName]);
};
