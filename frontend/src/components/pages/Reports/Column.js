import React from "react";
import "./Column.css";

const Column = React.memo((props) => {
  const backgroundColor = props.markedEntryOrNot
    ? "#e490e8"
    : props.count % 2 === 0
    ? "#fff"
    : "#F7F7F7";
  return (
    <div style={{ backgroundColor }} className="reports_column_container">
      <div className="reports_column_count_lable">
        <h3>{props.count + 1}</h3>
      </div>

      <div className="reports_column_sale_date_lable">
        <h3>{props.saleDate.slice(0, 10)}</h3>
      </div>

      <div className="reports_column_customer_name_lable">
        <h3>{props.customerName}</h3>
      </div>

      <div className="reports_column_sale_total_amount_lable">
        <h3>₹ {props.saleTotalAmount}</h3>
      </div>

      <input
        type="checkbox"
        onChange={props.handleToggleFromParent}
        checked={props.markedEntryOrNot}
        className="reports_column_checkbox"
      />
    </div>
  );
});

export default React.memo(Column);
