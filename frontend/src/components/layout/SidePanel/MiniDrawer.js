import React, { Suspense, lazy, useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import SettingsMenu from "./SettingsMenu";
import AppBarComponent from "./AppBarComponent";
import DrawerComponent from "./DrawerComponent";
import Calculator from "../../../utils/calculator/Calculator";
import Expense from "../../pages/Expense/Expense";
import Master from "../../pages/Master/Master";

// Lazy-loaded components
const Dashboard = lazy(() => import("../../pages/Dashboard/Dashboard"));
const Purchase = lazy(() => import("../../pages/Purchase/Purchase"));
const Sale = lazy(() => import("../../pages/Sale/Sale"));
const Receipt = lazy(() => import("../../pages/Receipt/Receipt"));
const Payment = lazy(() => import("../../pages/Payment/Payment"));
const LedgerStatement = lazy(() =>
  import("../../pages/LedgerStatement/LedgerStatement")
);
const Salary = lazy(() => import("../../pages/Salary/Salary"));

const BankStatement = lazy(() =>
  import("../../pages/BankStatement/BankStatement")
);
const Reports = lazy(() => import("../../pages/Reports/Reports"));
const VoucherTemplate = lazy(() =>
  import("../../pages/VoucherTemplate/VoucherTemplate")
);
const FileSystem = lazy(() => import("../../pages/FileSystem/FileSystem"));
const RecycleBin = lazy(() => import("../../pages/RecycleBin/RecycleBin"));

export default function MiniDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Retrieve moduleVisibility from localStorage
  const getInitialModuleVisibility = () => {
    const savedVisibility = localStorage.getItem("moduleVisibility");
    return savedVisibility
      ? JSON.parse(savedVisibility)
      : {
          dashboard: true,
          sale: true,
          purchase: true,
          receipt: true,
          payment: true,
          master: true,
          ledgerStatement: true,
          salary: true,
          expense: true,
          bankStatement: true,
          reports: true,
          voucherTemplate: true,
          fileSystem: true,
          recycleBin: true,
        };
  };

  const [moduleVisibility, setModuleVisibility] = useState(
    getInitialModuleVisibility
  );

  // Save moduleVisibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("moduleVisibility", JSON.stringify(moduleVisibility));
  }, [moduleVisibility]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleCalculatorToggle = () => setCalculatorOpen(!calculatorOpen);
  const handleSettingsClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseSettingsMenu = () => setAnchorEl(null);
  const handleNavigation = (linkUrl) => {
    if (location.pathname !== linkUrl) {
      navigate(linkUrl);
    }
  };

  const openSettingsMenu = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarComponent
        open={open}
        onDrawerOpen={handleDrawerOpen}
        onSettingsClick={handleSettingsClick}
        onCalculatorToggle={handleCalculatorToggle}
      />
      <DrawerComponent
        open={open}
        onDrawerClose={handleDrawerClose}
        onNavigate={handleNavigation}
        location={location}
        moduleVisibility={moduleVisibility}
      />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerComponent.DrawerHeader />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/master" element={<Master />} />
            <Route path="/ledgerStatement" element={<LedgerStatement />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/bankStatement" element={<BankStatement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/voucherTemplate" element={<VoucherTemplate />} />
            <Route path="/fileSystem" element={<FileSystem />} />
            <Route path="/recycleBin" element={<RecycleBin />} />
          </Routes>
        </Suspense>
      </Box>

      <SettingsMenu
        anchorEl={anchorEl}
        open={openSettingsMenu}
        onClose={handleCloseSettingsMenu}
        moduleVisibility={moduleVisibility}
        setModuleVisibility={setModuleVisibility}
      />
      {calculatorOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <Box
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              backgroundColor: "white",
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Calculator onClose={handleCalculatorToggle} />
          </Box>
        </Suspense>
      )}
    </Box>
  );
}
