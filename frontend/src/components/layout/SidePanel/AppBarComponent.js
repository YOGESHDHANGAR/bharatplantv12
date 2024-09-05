import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import CalculateIcon from "@mui/icons-material/Calculate";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import ImportIcon from "@mui/icons-material/ImportExport";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useGetDatabaseExport } from "../../../api/queries/exportQueries";
import { handleDatabaseExport } from "../../../utils/export/handleDatabaseExport";
import DateRangeFilter from "../../../utils/date/DateRangeFilter";
import CompanySelect from "../../common/companySelect/CompanySelect";
import WhatsAppModal from "../../common/WhatsApp/WhatsAppModal";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 200,
    width: `calc(100% - 200px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function AppBarComponent({
  open,
  onDrawerOpen,
  onSettingsClick,
  onCalculatorToggle,
}) {
  const [dateRange, setDateRange] = useState(() => {
    const storedRange = localStorage.getItem("dateRange");
    return storedRange ? JSON.parse(storedRange) : [null, null];
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [isWhatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  const { refetch, isError, isFetching, isLoading } = useGetDatabaseExport();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportClick = () => {
    handleDatabaseExport(refetch);
    handleMenuClose();
  };

  const handleImport = () => {
    console.log("Import clicked");
    handleMenuClose();
  };

  const handleWhatsAppImport = () => {
    setWhatsAppModalOpen(true);
    handleMenuClose();
  };

  const handleWhatsAppModalClose = () => {
    setWhatsAppModalOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <CompanySelect />
          <DateRangeFilter setDateRange={setDateRange} />
          <IconButton
            color="inherit"
            aria-label="settings"
            onClick={onSettingsClick}
            sx={{ marginLeft: "auto" }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="calculator"
            onClick={onCalculatorToggle}
          >
            <CalculateIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="more options"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={handleExportClick}
              disabled={isFetching || isLoading}
            >
              <ListItemIcon>
                <SubdirectoryArrowRightIcon />
              </ListItemIcon>
              <ListItemText primary="Export" />
            </MenuItem>
            <MenuItem onClick={handleImport}>
              <ListItemIcon>
                <ImportIcon />
              </ListItemIcon>
              <ListItemText primary="Import" />
            </MenuItem>
            <MenuItem onClick={handleWhatsAppImport}>
              <ListItemIcon>
                <WhatsAppIcon />
              </ListItemIcon>
              <ListItemText primary="WhatsApp Import" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <WhatsAppModal
        open={isWhatsAppModalOpen}
        onClose={handleWhatsAppModalClose}
      />
    </>
  );
}
