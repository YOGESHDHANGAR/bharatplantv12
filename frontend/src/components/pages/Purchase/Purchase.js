import React from "react";
import PurchaseEntry from "./PurchaseEntry";
import BasicTabs from "../../BasicTabs/BasicTabs";
import PurchaseReport from "./purchaseReport/PurchaseReport";

const Purchase = () => {
  return (
    <BasicTabs
      moduleName="Purchase"
      component1={<PurchaseEntry />}
      component2={<PurchaseReport />}
    />
  );
};

export default React.memo(Purchase);
