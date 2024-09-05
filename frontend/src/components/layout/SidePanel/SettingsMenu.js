import { useState } from "react";
import {
  FormControlLabel,
  Switch,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Box,
} from "@mui/material";

export default function SettingsMenu({
  anchorEl,
  onClose,
  moduleVisibility = {}, // Provide a default empty object
  setModuleVisibility,
}) {
  const [activeTab, setActiveTab] = useState(0);

  const handleToggle = (module) => {
    setModuleVisibility((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Example structure for different tabs
  const tabs = [
    { label: "Module Settings", modules: moduleVisibility }, // The current module visibility settings
    { label: "Other Settings", modules: {} }, // Placeholder for other settings
    { label: "Advanced Settings", modules: {} }, // Placeholder for more settings
  ];

  const hasModules = Object.keys(tabs[activeTab].modules).length > 0;

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      {hasModules ? (
        Object.keys(tabs[activeTab].modules).map((module) => (
          <MenuItem key={module}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!tabs[activeTab].modules[module]} // Safeguard to ensure boolean value
                  onChange={() => handleToggle(module)}
                  size="small"
                />
              }
              label={module}
            />
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No settings available</MenuItem>
      )}
    </Menu>
  );
}
