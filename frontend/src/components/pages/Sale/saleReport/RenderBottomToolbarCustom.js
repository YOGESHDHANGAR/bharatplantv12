import React, { useState } from "react";
import CommonTableFooter from "../../../common/table/CommonTableFooter";

const RenderBottomToolbarCustom = ({ table, totalRecords, vouchersTotal }) => {
  return (
    <CommonTableFooter
      table={table}
      preVoucherTotalText={"Sale Total"}
      totalRecords={totalRecords}
      vouchersTotal={vouchersTotal}
      vouchersTotalColor={"green"}
    />
  );
};

export default RenderBottomToolbarCustom;
