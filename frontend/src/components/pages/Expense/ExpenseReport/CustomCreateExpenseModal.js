import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const CustomCreateExpenseModal = ({ open, onClose, onSave }) => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      amount: "",
      date: "",
      category: "",
    },
  });

  const onSubmit = (data) => {
    onSave(data);
    onClose(); // Close the modal after saving
    reset(); // Reset the form to default values
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Expense</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                label="Expense Name"
                variant="standard" // Using the standard variant
                {...field}
                fullWidth
              />
            )}
          />
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                label="Amount"
                type="number"
                variant="standard" // Using the standard variant
                {...field}
                fullWidth
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                label="Date"
                type="date"
                variant="standard" // Using the standard variant
                InputLabelProps={{ shrink: true }}
                {...field}
                fullWidth
              />
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                label="Category"
                variant="standard" // Using the standard variant
                {...field}
                fullWidth
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomCreateExpenseModal;
