import React from "react";
import SaleEntry from "./SaleEntry";
import BasicTabs from "../../BasicTabs/BasicTabs";
import SaleReport from "./saleReport/SaleReport";

const Sale = () => {
  return (
    <BasicTabs
      moduleName="Sale"
      component1={<SaleEntry />}
      component2={<SaleReport />}
    />
  );
};

export default React.memo(Sale);
