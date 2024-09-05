import React, { useState } from "react";
import CommonTableFooter from "../../../common/table/CommonTableFooter";

const RenderBottomToolbarCustome = ({ table, totalRecords, vouchersTotal }) => {
  return (
    <CommonTableFooter
      table={table}
      preVoucherTotalText={"Purchase Total"}
      totalRecords={totalRecords}
      vouchersTotal={vouchersTotal}
      vouchersTotalColor={"red"}
    />
  );
};

export default RenderBottomToolbarCustome;
