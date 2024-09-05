import React from "react";
import ReceiptEntry from "./ReceiptEntry";
import BasicTabs from "../../BasicTabs/BasicTabs";
import ReceiptReport from "./receiptReport/ReceiptReport";

const Receipt = () => {
  return (
    <BasicTabs
      moduleName="Receipt"
      component1={<ReceiptEntry />}
      component2={<ReceiptReport />}
    />
  );
};

export default React.memo(Receipt);
