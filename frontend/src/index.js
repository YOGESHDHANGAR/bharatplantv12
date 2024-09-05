import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider, createTheme, colors, CssBaseline } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { toast, Toaster } from "sonner";
import { HotKeys } from "react-hotkeys";
import HealthCheck from "./HealthCheck";

// Add global error handling
window.addEventListener("unhandledrejection", (event) => {
  console.error(
    "Unhandled rejection (promise: ",
    event.promise,
    ", reason: ",
    event.reason,
    ")."
  );
  toast.error("An unexpected error occurred.");
  event.preventDefault();
});

window.addEventListener("error", (event) => {
  console.error("Error occurred: ", event.message);
  toast.error("An unexpected error occurred.");
  event.preventDefault();
});

const keyMap = {
  SNAP_LEFT: "command+left",
  DELETE_NODE: ["del", "backspace"],
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 30,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: colors.orange[500],
    },
    secondary: {
      main: colors.grey[200],
    },
    neutral: {
      main: colors.blue[900],
    },
  },
  mixins: {
    toolbar: {
      height: 35,
    },
  },
  typography: {
    fontSize: 13,
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 35,
          height: 35,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 35,
          height: 35,
        },
      },
    },
    MuiPaper: {
      elevation: 5,
    },
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "2px",
        },
        "*::-webkit-scrollbar-track": {
          background: "#E4EFEF",
        },
        "*::-webkit-scrollbar-thumb": {
          background: "#1D388F61",
          borderRadius: "2px",
        },
      },
    },
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       height: 32, // Set the desired height
    //       minWidth: 64, // Set the desired minimum width
    //       fontSize: "0.75rem", // Adjust font size to fit the smaller button
    //       padding: "4px 12px", // Adjust padding for smaller button
    //     },
    //     // Optionally, you can define sizes for different button variants
    //     contained: {
    //       height: 32, // Set height for contained variant
    //       minWidth: 64, // Set minimum width for contained variant
    //       padding: "4px 12px",
    //     },
    //     outlined: {
    //       height: 32, // Set height for outlined variant
    //       minWidth: 64, // Set minimum width for outlined variant
    //       padding: "4px 12px",
    //     },
    //     text: {
    //       height: 32, // Set height for text variant
    //       minWidth: 64, // Set minimum width for text variant
    //       padding: "4px 12px",
    //     },
    //   },
    // },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <HealthCheck>
          <HotKeys keyMap={keyMap}>
            <App />
            <Toaster richColors position="top-right" />
            <CssBaseline />
          </HotKeys>
        </HealthCheck>
      </LocalizationProvider>
    </ThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
