import React, { useState } from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="reports_header_container">
      <div className="reports_header_count_lable">
        <h3>Count</h3>
      </div>
      <div className="reports_header_sale_date_lable">
        <h3>Date</h3>
      </div>
      <div className="reports_header_customer_name_lable">
        <h3>Customer Name</h3>
      </div>
      <div className="reports_header_sale_total_amount_lable">
        <h3>Amount</h3>
      </div>
      <div className="reports_header_checkbox">
        <h3>Mark</h3>
      </div>
    </div>
  );
};

export default React.memo(Header);
