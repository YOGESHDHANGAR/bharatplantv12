import React, { useState } from "react";
import CommonTableFooter from "../../../common/table/CommonTableFooter";

const RenderBottomToolbarCustome = ({ table, totalRecords, vouchersTotal }) => {
  return (
    <CommonTableFooter
      table={table}
      preVoucherTotalText={"Receipt Total"}
      totalRecords={totalRecords}
      vouchersTotal={vouchersTotal}
      vouchersTotalColor={"green"}
    />
  );
};

export default RenderBottomToolbarCustome;
