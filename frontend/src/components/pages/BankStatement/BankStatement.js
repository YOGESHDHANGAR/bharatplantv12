import React from "react";
import BasicTabs from "../../BasicTabs/BasicTabs";
import BankStatementReport from "./bankStatementReport/BankStatementReport";

const BankStatement = () => {
  return (
    <BasicTabs
      moduleName="BankStatement"
      component1={<>Tab1 Data</>}
      component2={<BankStatementReport />}
    />
  );
};

export default BankStatement;
