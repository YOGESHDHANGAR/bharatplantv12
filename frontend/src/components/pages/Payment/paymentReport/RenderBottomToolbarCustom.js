import React, { useState } from "react";
import CommonTableFooter from "../../../common/table/CommonTableFooter";

const RenderBottomToolbarCustom = ({ table, totalRecords, vouchersTotal }) => {
  return (
    <CommonTableFooter
      table={table}
      preVoucherTotalText={"Payment Total"}
      totalRecords={totalRecords}
      vouchersTotal={vouchersTotal}
      vouchersTotalColor={"red"}
    />
  );
};

export default RenderBottomToolbarCustom;
