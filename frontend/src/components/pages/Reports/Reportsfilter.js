// import React, { useEffect, useState } from "react";
// import "./Reportsfilter.css";
// import "react-datepicker/dist/react-datepicker.css";
// import { useDispatch } from "react-redux";
// import { getAllSales } from "../../redux/actions/saleAction";

// const Reportsfilter = (props) => {
//   const dispatch = useDispatch();
//   const [_Id, set_Id] = useState();
//   const [customerName, setCustomerName] = useState(); //
//   const [purchaseShift, setPurchaseShift] = useState(); //

//   const [saleToCustomer, setSaleToCustomer] = useState();
//   const [fromDate, setFromDate] = useState();
//   const [toDate, setToDate] = useState();

//   const [fromDateformat, setFromdateformat] = useState("");
//   const [toDateformat, setToDateformat] = useState("");

//   const handlecustomerId = (event) => {
//     setSaleToCustomer(event.target.value);
//     const correspondingCustomer = props.allcustomers;

//     for (let i = 0; i < correspondingCustomer.length; i++) {
//       if (
//         Number(correspondingCustomer[i].customer_id) ===
//         Number(event.target.value)
//       ) {
//         setCustomerName(correspondingCustomer[i].customer_name);
//       }
//     }
//   };

//   const handleName = (event) => {
//     setCustomerName(event.target.value);
//     const correspondingCustomer = props.allcustomers;
//     for (let i = 0; i < correspondingCustomer.length; i++) {
//       if (
//         String(correspondingCustomer[i].customer_name) ===
//         String(event.target.value)
//       ) {
//         setSaleToCustomer(correspondingCustomer[i].customer_id);
//       }
//     }
//   };

//   const handleFromDate = (e) => {
//     const getfromdatevalue = e.target.value;
//     const setfromformat = getfromdatevalue.split("-");
//     const setfromyear = setfromformat[0];
//     const setfrommonth = setfromformat[1];
//     const setfromdate = setfromformat[2];
//     const setfromformatdate =
//       setfromyear + "" + setfrommonth + "" + setfromdate;
//     setFromDate(getfromdatevalue);
//     setFromdateformat(setfromformatdate);
//   };

//   const handleToDate = (e) => {
//     const gettodatevalue = e.target.value;
//     const setdateformat = gettodatevalue.split("-");
//     const settoyear = setdateformat[0];
//     const settomonth = setdateformat[1];
//     const settodate = setdateformat[2];
//     const settodateformat = settoyear + "" + settomonth + "" + settodate;
//     setToDate(gettodatevalue);
//     setToDateformat(settodateformat);
//   };

//   const handleShift = (event) => {
//     setPurchaseShift(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (fromDateformat > toDateformat) {
//       alert("Please select valid date");
//     }

//     dispatch(
//       getAllSales(customerId, customerName, fromDate, toDate, purchaseShift)
//     );
//   };

//   const handleClearLocalStorage = () => {
//     localStorage.removeItem("home_markedEntriesArray");
//     window.location.reload();
//   };

//   return (
//     <form className="filter_container" onSubmit={handleSubmit}>
//       <label className="customerid_lable">
//         Customer Id:
//         <select
//           name="select_customerId"
//           value={customerId}
//           onChange={handlecustomerId}
//         >
//           <option>Select</option>
//           {props.loading === false &&
//             props.allcustomers.map((elem, index) => {
//               return <CustomecustomerId key={index} elem={elem} />;
//             })}
//         </select>
//       </label>
//       <label className="name_lable">
//         Name:
//         <select name="select_name" value={customerName} onChange={handleName}>
//           <option>Select</option>

//           {props.loading === false &&
//             props.allcustomers.map((elem, index) => {
//               return <Customename key={index} elem={elem} />;
//             })}
//         </select>
//       </label>
//       <label className="fromdate_lable">
//         From_Date:
//         <input
//           type="date"
//           className="fromdate_datepicker"
//           onChange={(e) => handleFromDate(e)}
//         />
//       </label>
//       <label className="todate_lable">
//         To_Date:
//         <input
//           type="date"
//           className="todate_datepicker"
//           onChange={(e) => handleToDate(e)}
//         />
//       </label>
//       <label className="shift_lable">
//         Shift:
//         <select
//           name="select_shift"
//           value={purchaseShift}
//           onChange={handleShift}
//         >
//           <option value="Both">Both</option>
//           <option value="Morning">Morning</option>
//           <option value="Evening">Evening</option>
//         </select>
//       </label>
//       <input className="submit_input" type="submit" value="Submit" />
//       <input
//         className="clear_input"
//         type="button"
//         value="Clear Marks"
//         onClick={handleClearLocalStorage}
//       />
//     </form>
//   );
// };

// const Customename = (props) => {
//   return (
//     <option value={props.elem.customer_name}>{props.elem.customer_name}</option>
//   );
// };

// const CustomecustomerId = (props) => {
//   return (
//     <option value={props.elem.customer_id}>{props.elem.customer_id}</option>
//   );
// };

// export default Reportsfilter;

import React from "react";

const Reportsfilter = () => {
  return <div>Reportsfilter</div>;
};

export default Reportsfilter;
