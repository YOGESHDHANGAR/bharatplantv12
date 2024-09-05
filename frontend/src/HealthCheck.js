import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const HealthCheck = ({ children }) => {
  const [serverUp, setServerUp] = useState(null);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await fetch("http://localhost:5894/api/v1/health");
        console.log("response", response);
        if (response.ok) {
          setServerUp(true);
        } else {
          throw new Error("Server is not running");
        }
      } catch (error) {
        setServerUp(false);
        toast.error(
          "The backend server is not running. Please start the server."
        );
      }
    };

    checkServerHealth();
  }, []);

  if (serverUp === null) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography variant="h6" color="textSecondary" marginTop={2}>
          Checking server status...
        </Typography>
      </Box>
    );
  }

  if (!serverUp) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        p={2}
      >
        <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
          Server is down. Please start the backend server.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default HealthCheck;
