// import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useSelector, useDispatch } from "react-redux";
// import "./Reports.css";
// import Column from "./Column";
// import Loading from "../Loading/Loading";
// import Header from "./Header";
// import Metadata from "../Medtadata/Metadata";
// import Reportsfilter from "./Reportsfilter";
// import { getAllSales } from "../../redux/actions/saleAction";
// import { clearErrors, getAllCustomers } from "../../redux/actions/ledgerAction";

// const Reports = () => {
//   const showErrorToast = (message) => {
//     toast.error(message, {
//       autoClose: 5000,
//     });
//   };
//   const dispatch = useDispatch();

//   const {
//     sales,
//     error: salesError,
//     loading: salesLoading,
//   } = useSelector((state) => state.saleState);

//   const {
//     customers,
//     error: customersError,
//     loading: customersLoading,
//   } = useSelector((state) => state.customerState);

//   const [storedArrayInParent, setStoredArrayInParent] = useState([]);
//   const [salesState, setSalesState] = useState(sales);

//   const handleToggleFromParent = (purchase_serial) => {
//     const containsOrNot = storedArrayInParent.includes(purchase_serial);
//     const updatedArray = containsOrNot
//       ? storedArrayInParent.filter((item) => item !== purchase_serial)
//       : [...storedArrayInParent, purchase_serial];

//     setStoredArrayInParent(updatedArray);
//   };

//   useEffect(() => {
//     setSalesState(sales);
//   }, [sales]);

//   useEffect(() => {
//     const storedArray = localStorage.getItem("home_markedEntriesArray");
//     if (storedArray) {
//       setStoredArrayInParent(JSON.parse(storedArray));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem(
//       "home_markedEntriesArray",
//       JSON.stringify(storedArrayInParent)
//     );
//   }, [storedArrayInParent]);

//   useEffect(() => {
//     dispatch(getAllSales());
//     dispatch(getAllCustomers());
//   }, [dispatch]);

//   useEffect(() => {
//     if (salesError) {
//       showErrorToast(salesError);
//       dispatch(clearErrors());
//     }
//     if (customersError) {
//       showErrorToast(customersError);
//       dispatch(clearErrors());
//     }
//   }, [salesError, customersError]);

//   return (
//     <div>
//       <Metadata title="Reports" />
//       {/* <Reportsfilter customers={customers} loading={customersLoading} /> */}
//       <Header />
//       {salesLoading === true ? (
//         <Loading />
//       ) : salesState.getAllSalesResult === undefined ||
//         salesState.getAllSalesResult.length === 0 ? (
//         <div className="no_result_found">
//           <h1>No Result Found!</h1>
//         </div>
//       ) : (
//         salesState.getAllSalesResult.map((elem, index) => {
//           return (
//             <Column
//               key={index}
//               count={index}
//               saleDate={elem.saleDate}
//               customerName={elem.saleToCustomer.customerName}
//               saleTotalAmount={elem.saleTotalAmount}
//               handleToggleFromParent={() => {
//                 handleToggleFromParent(elem._id);
//               }}
//               markedEntryOrNot={storedArrayInParent.includes(elem._id)}
//             />
//           );
//         })
//       )}
//       <ToastContainer />
//     </div>
//   );
// };

// export default Reports;
import React from "react";

const Reports = () => {
  return <div>Reports</div>;
};

export default Reports;
