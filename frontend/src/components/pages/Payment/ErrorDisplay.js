import React from "react";
import { Stack, Typography, Button } from "@mui/material";
import { toast } from "sonner";

const ErrorDisplay = ({ errors }) => {
  return (
    <>
      {Object.keys(errors).length > 0 && (
        <Stack spacing={2} sx={{ pt: 2 }}>
          {Object.values(errors).map((error, index) =>
            toast.error(error.message, { duration: 2000 })
          )}
        </Stack>
      )}
    </>
  );
};

export default React.memo(ErrorDisplay);
