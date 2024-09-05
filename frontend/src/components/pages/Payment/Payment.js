import React from "react";
import PaymentEntry from "./PaymentEntry";
import BasicTabs from "../../BasicTabs/BasicTabs";
import PaymentReport from "./paymentReport/PaymentReport";

const Payment = () => {
  return (
    <BasicTabs
      moduleName="Payment"
      component1={<PaymentEntry />}
      component2={<PaymentReport />}
    />
  );
};

export default React.memo(Payment);
