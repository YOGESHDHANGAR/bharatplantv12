import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { Button } from "@mui/material";
import Invoice from "../../common/invoice/Invoice";

const PrintButton = () => {
  const invoiceRef = useRef();

  return (
    <>
      <ReactToPrint
        trigger={() => (
          <Button
            startIcon={<LocalPrintshopOutlinedIcon />}
            variant="contained"
            color="primary"
          >
            Print Invoice
          </Button>
        )}
        content={() => invoiceRef.current}
      />
      {/* Hidden invoice component for printing */}
      <div style={{ display: "none" }}>
        <Invoice ref={invoiceRef} />
      </div>
    </>
  );
};

export default PrintButton;
