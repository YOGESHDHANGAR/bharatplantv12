import React, { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const Ledger = lazy(() => import("../../pages/Ledger/Ledger"));
const Employee = lazy(() => import("../../pages/Employee/Employee"));
const Items = lazy(() => import("../../pages/Items/Items"));
const Company = lazy(() => import("../../pages/Company/Company"));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            px: 2,
            py: 0.5,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Master() {
  const tabKey = "master-selectedTabIndex"; // Unique key for storing the selected tab index
  const storedTabIndex = localStorage.getItem(tabKey);
  const defaultTab = storedTabIndex ? parseInt(storedTabIndex, 10) : 0;

  const [value, setValue] = React.useState(defaultTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem(tabKey, newValue); // Save selected tab index to localStorage
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Ledger" {...a11yProps(0)} />
          <Tab label="Employee" {...a11yProps(1)} />
          <Tab label="Items" {...a11yProps(2)} />
          <Tab label="Company" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Suspense fallback={<div>Loading...</div>}>
          <Ledger />
        </Suspense>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Suspense fallback={<div>Loading...</div>}>
          <Employee />
        </Suspense>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Suspense fallback={<div>Loading...</div>}>
          <Items />
        </Suspense>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Suspense fallback={<div>Loading...</div>}>
          <Company />
        </Suspense>
      </CustomTabPanel>
    </Box>
  );
}
