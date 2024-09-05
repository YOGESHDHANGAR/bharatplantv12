import React, { useState } from "react";
import CommonTableFooter from "../../../common/table/CommonTableFooter";

const RenderBottomToolbarCustom = ({
  table,
  totalRecords,
  vouchersTotalSum,
}) => {
  return (
    <CommonTableFooter
      table={table}
      preVoucherTotalText={"Balance"}
      totalRecords={totalRecords}
      vouchersTotal={vouchersTotalSum}
      vouchersTotalColor={vouchersTotalSum >= 0 ? "green" : "red"}
    />
  );
};

export default RenderBottomToolbarCustom;
