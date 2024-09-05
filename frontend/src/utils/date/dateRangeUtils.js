import moment from "moment";

export const getDateRange = (
  radioSelectedByUser,
  customStartDate,
  customEndDate
) => {
  let start, end;

  switch (radioSelectedByUser) {
    case "today":
      start = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
      end = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
      break;
    case "yesterday":
      start = moment()
        .subtract(1, "day")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      end = moment()
        .subtract(1, "day")
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      break;
    case "1_week":
      start = moment()
        .subtract(1, "week")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      end = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
      break;
    case "1_month":
      start = moment()
        .subtract(1, "month")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      end = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
      break;
    case "this_academic_year":
      start = moment("2024-01-01").startOf("day").format("YYYY-MM-DD HH:mm:ss");
      end = moment("2025-12-31").endOf("day").format("YYYY-MM-DD HH:mm:ss");
      break;
    case "this_financial_year":
      start = moment("2024-04-01").startOf("day").format("YYYY-MM-DD HH:mm:ss");
      end = moment("2025-03-31").endOf("day").format("YYYY-MM-DD HH:mm:ss");
      break;
    case "financial_year_2023":
      start = moment("2023-04-01").startOf("day").format("YYYY-MM-DD HH:mm:ss");
      end = moment("2024-03-31").endOf("day").format("YYYY-MM-DD HH:mm:ss");
      break;
    case "financial_year_2022":
      start = moment("2022-04-01").startOf("day").format("YYYY-MM-DD HH:mm:ss");
      end = moment("2023-03-31").endOf("day").format("YYYY-MM-DD HH:mm:ss");
      break;
    case "financial_year_2021":
      start = moment("2021-04-01").startOf("day").format("YYYY-MM-DD HH:mm:ss");
      end = moment("2022-03-31").endOf("day").format("YYYY-MM-DD HH:mm:ss");
      break;
    case "financial_year_2020":
      start = moment("2020-04-01").startOf("day").format("YYYY-MM-DD HH:mm:ss");
      end = moment("2021-03-31").endOf("day").format("YYYY-MM-DD HH:mm:ss");
      break;
    case "all":
      start = moment("2000-04-01").startOf("day").format("YYYY-MM-DD HH:mm:ss");
      end = moment("2050-03-31").endOf("day").format("YYYY-MM-DD HH:mm:ss");
      break;
    default:
      // Ensure customStartDate and customEndDate are valid moment objects
      start = customStartDate
        ? moment(customStartDate).startOf("day").format("YYYY-MM-DD HH:mm:ss")
        : moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
      end = customEndDate
        ? moment(customEndDate).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        : moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
  }

  return { startDate: start, endDate: end };
};
