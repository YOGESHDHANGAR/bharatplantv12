import React, { forwardRef } from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";

const Invoice = forwardRef((props, ref) => {
  const invoiceData = {
    companyName: "Bharat Mawa Point Chakeri",
    companyAddress: {
      line1: "Village Chaker, Tehsil Anjad, District Badwani,",
      line2: "Madhya Pradesh, 451556",
    },
    logo: "https://logowik.com/content/uploads/images/zoho.jpg", // Placeholder logo URL
    partyName: "Nitin Gupta Indore",
    totalBalance: "₹500.00",
    previousBalance: "₹200.00",
    invoiceNumber: "INV-0001",
    date: "August 16, 2024",
    dueDate: "August 30, 2024",
    items: [
      { description: "Mawa A1", quantity: 2, unit: "kg", price: 50 },
      { description: "Mawa Jamun", quantity: 1, unit: "ltr", price: 100 },
      { description: "Milk Cake", quantity: 7, unit: "kg", price: 40 },
      { description: "Milk Cake", quantity: 7, unit: "kg", price: 40 },
      { description: "Milk Cake", quantity: 7, unit: "kg", price: 40 },
      { description: "Milk Cake", quantity: 7, unit: "kg", price: 40 },
      { description: "Milk Cake", quantity: 7, unit: "kg", price: 40 },
      { description: "Milk Cake", quantity: 7, unit: "kg", price: 40 },
      { description: "Milk Cake", quantity: 7, unit: "kg", price: 40 },
    ],
    bankDetails: {
      bankName: "State Bank of India",
      accountNumber: "123456789",
      ifsc: "SBI0001234",
      upiId: "bharatmawapoint@upi",
      mobileNumbers: ["+91 9876543210", "+91 9876543211"],
      qrCode:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8AAAB4eHgnJye7u7vo6OiioqJwcHDy8vLBwcFnZ2evr6/i4uKHh4dVVVWcnJy1tbU1NTXS0tKVlZWpqamOjo7Y2Nh/f3/Hx8dMTEzx8fH4+Phra2sbGxtHR0fg4OA8PDwREREwMDBcXFwiIiIYGBgxMTFBQUH/lneRAAAKh0lEQVR4nO2df0OyMBDH0xBFU0nwJ6SWVu//HT7ujie/eAyHYFrd9y8a27GP6ca22+3hQaVSqVQqlUqlUqlUKpVKpVKpVKWKu21HzbEYpaQJXUfmursRphdg2of0JD2mp5w0d61EN65M2G256gWLcdKKrpd0PRGmB1A4hfQVWuWkF+dadCsTtp1tP0rCHl2PHAixYj1J+Ohci7YSKmE1Qm5pXH6HfUhPbkE4DLwSxTbC4dQoNHlCbnU8kzScAGGfTHPKigpEbFUSxmWVCIa1CIPSPB0bIasD6XNKGQDhEO4+oSFJiIakglqEXmmeM4RPkD50IHxGE3ztQugpoUVKaHQhYSwIc4ZuQTgZ+yfybISx0WBfSjjzKRfaiyHFRuidVmI8aYxw3DrVzkbIei4lZAVgbkkp1v6QCXeiFuPGCH1hu98s4YhSrO80TNgXtfCVUAkvJ3y0EIalhAXjw7siHIQHZf8kPzpouhKEcy/8UmzyRG0gTKbRl6Z3SIgfvdRQmOD+cAaEBfoFhBMlVEIlbJCwPT8o95zJ4qBgJQiXQ5N1bO4uQio2pevFnRNKren2RBByxbg/TMHQ/scR4lwbEo6BkOfacuNDJVTCbyTE+dJyws6tCb1d/0SRJJzMvpRNAg9Nzp1HSZG5Tj8F4W5j7gYuhNFpJXZeY4Q2FfSHLHznTimFJ159QYg6Q2jTTQh7kKkLhGMlPJUSGimhTUwYd8o0kYRLo+2GbicOhHsqsEZCto2Ek9JaxLUIXVQwtuAZ4Y0DIVcs1x+iobtaIcWK4VxbOWHBO40SKmHzhHtZsY+LCD+kof0VCecvj27ab7FiidHDen+4kSP0KD2i6+jB/BG8HvK8tOl60zKG1nSdIOF271iLl3kxRpPCDzSBdJtzFc6Xrum6YO3proTVkz2+jRBnogrWLe5KSqiEP4sQWxo5+YCEuDJTsLp2feH0ylTc7cjKYCXRd3YK6Ty9soCUkTQhzfHcCH8lcKm1nrBikYWwgrcJS46erIT4TjOjFHYfw6VWJVTCv024wspUJfTulRCbwKWNDQltYwtWwfqhO2EMd6uPLZRQCZXwXgixCZSEWxdCfi/lqeUIDLFwBFxAiOaYsN0wYbLq/VcSPj4/P78Nk6+U3mZ/SPlYlxNS/lVyNJddL0zhtzabsxHyk9dASCaSyNTl0TeFk0EtQlRIlnA+JOdgYCO0CWeickJC1hIIWfxlqLdCKmUjLFi3UEIjJQR9F6H8RedGwFUJuVHuyxs2QhxQMyF3O/zJ41ZNN0XL0Wi0REes3pMRruUlG5OyWR9yjjJPes7zVkoYkOmoc2quR4bYR6W1G31p904p62PKckCFV5Z6ucllhTTjxP8bJ0k/b5TcM5MRyq+BTU2MLZTwKCUUuivC8h2WmaoSyp1drFXLWc0Rjrrn1Z5NDuJX6BanvJcSdkz+SZgecqY4znig9ImNamCeM0uBMOgbE5fOnbqvkGYRB+QNlx6/oBuzPcc2epIz1U0TXuedRgmVsEnC15sR+o0RzhdBECzklomtSQ+CIYmucY6jgDCYHzLOA0G4mg+PYqOkBcc2GZhrbyUInyhTTKWqt6hIyKVxkpqV29zKxcoJcZ5Gepu00BBLeu7JOW8PDF1KyNFtwvqE5f40tQjreQwp4c8kRAcD30L4iVTuhPg7xF1BBYSvFkIcEVxKuBh8KeZ2ehMPTjUmcSYuBjdjnAUNIpOTLbC5J/ojJgu5Zto3KdmscXh8TNQBwq7JFNWLOOAi/ujfXbJi9BbUTHwxCv6TOCM8hzz1Ig646MyeGZTcrc6yjiQwE861IWHTc21SSgj60YROv0MZcYDlROjyO6z+TiNla0uzwIBwN+bVpYCuO0DYDo9tKasTibaUFYommx4Q8nQqtqUzMuEyo3RO1v6QhTdkVEG5EInK9YdScndeEzwuhNY1YBmRTnqboHLvNC6EzXmbKOFvJyxYfr+MsPLvsAnCyXGkHfAr9AQH4qQpj+u5AN2duhC2YRTP4gmXlylZ5Ux0PX2laxrjB9HxwXM2+gQmZHjGc5JjCyn+6F8xyYXQpjN7ZrCTYeEO7CbG+DZCp+ieVyGs522ihH+JsCBScgKEs/smpLWnNKbVJW6zV7Q+xF4Dq/5x7Slry2jtKV3QahS/MPOSETdcS1iyYv6PtrnuIyEZ7fOCFu9d4xRu0Z/oYfxaSGtPmaF6EVpxbjkLhYBZ8UNn2TbVYTe2gIoVRI3AYhjAgOslA781ERcDPfcKwv9i4WcLoayYNfIHFrvmbKIS/l5CXLotIHy7iPDtewnRJ4oJh8YPqcOOFDvySWKxT9QSUjp9cmWSQfHH4MqUi09DJvpsgp+/PHpArZmQfai4UfbBUBPzNDICT06cCVO4P5QhVVly7YlV8GVANR2h1Z3QGhdjZCkg1y1YvXLCpmMMKeFfIizw8/4RhOilz4tixrf+v7g7eH0mX31yt09ezB9bfnSHUpDwkYrx21xELvYhEtLD/jvk9k6UvbS134yJl6O5zFc/20NQmTC1fPSsDaVkM1H40Vv+bS3sdlBdMGcV9oc8SOF+umlvE7kR5MwaMAr3zEhCp7k21jX9aZRQCZXwuwlRMRDKIGQ5cYEtVEw6V7EWQPhQ/vFINU0oR09nCGUUJUlo7fGVUAmVsEhjsOTU0vDLI0+q4guzbGnwhbnybgRsAb9BWIHEkkf2FqyCpVZZGN+U5T7gJnwxzghr3LPksRFa93Kj5AppEzudK0gJjZQQDMnCd0Voa2ls0yHWiAMo6TFUj7By3MTkKI6bWKB3qNIwV8JCSHETC3wxqHLvPpkILySsHPsS9eFQzDqxgoQ8sXPNmOwusp731ADh9aPOK6ES1iVsORNWjzhQOZ43a03xuV/pBoThXrE5n/7wgXC2NeG8+R/Q21JhJMTY3kjIhuJPUzjiJ1xIePVTOivEvrT1+PVmopRQCX85oVxQCYFwXpUQR8B4KG0ThE7nzEjCXWoOg9kA4dqk9H06eaZTTpiePjLNzuimwquGCSucFSRynvGCthLahBFzlFAJlfD2hIPbEXqLLxWcf3iGkI5NzPa0BXS9FYQeHZs4uh2hnKepQCgNLQUhxuS8CaGca2uYMFJCJaxLKIej8hxSSVjgEOBCeOnaU2VCPlSbjtweYEsTmuQxVnI3NgdvB0D4MT4WpvzR2J1wRIWr7ypt7Dxg6T7GwrFFSxpyJ2RdurOrAUKXEzxYuT0zVQlveKazEt4FoVwU29UnlL9DK+GnA2G93+Fk7J/IsxHGRr480aptSsU81dKPzR9c1Q6ZnkpCyjNmQwN4csxPEHKK8GgltMnpLNkufPT8dZebbq3nH0o1d/rD1U/pRFnPzpNSQnf9FcLy36+VULY0bCgqJTzTKLOaJhwGXolirNhwelDWig+OeYIREC4okw8meI5jReljJKQHZyALMLcThB0wVJ3QRWfmaVriyzCAdGvEcvwyfLZOhYS5jRv3R3gm9qV8p5GE37wGrIR3RGh7nZQqiDjgTngmUjITrh0Iq/8O427bUblTXC15utjULcB0QdiU9Hg3ZcJpqbmJMde1xX1QqVQqlUqlUqlUKpVKpVKpVCpVpn9lFgUCI6E3/AAAAABJRU5ErkJggg==", // Placeholder QR code URL
    },
  };

  const calculateTotal = () => {
    return invoiceData.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const total = calculateTotal();
  const finalBalance =
    total + parseFloat(invoiceData.previousBalance.replace("₹", ""));

  return (
    <Container maxWidth="md" ref={ref} sx={{ height: "800px", width: "800px" }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Box>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Box display="flex" alignItems="center">
                <img
                  src={invoiceData.logo}
                  alt="Company Logo"
                  style={{ height: 50, marginRight: 16 }}
                />
                <Box>
                  <Typography variant="h6">
                    {invoiceData.companyName}
                  </Typography>
                  <Typography variant="body2">
                    {invoiceData.companyAddress.line1}
                  </Typography>
                  <Typography variant="body2">
                    {invoiceData.companyAddress.line2}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="h3" align="right">
                Sales
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <Typography variant="h6">Party Name</Typography>
              <Typography variant="body1">{invoiceData.partyName}</Typography>
              <Typography variant="body1">
                Total Balance: {invoiceData.totalBalance}
              </Typography>
            </Grid>
            <Grid item xs={6} align="right">
              <Typography variant="body1">
                Invoice Number: {invoiceData.invoiceNumber}
              </Typography>
              <Typography variant="body1">Date: {invoiceData.date}</Typography>
              <Typography variant="body1">
                Due Date: {invoiceData.dueDate}
              </Typography>
            </Grid>
          </Grid>
          <TableContainer sx={{ marginTop: 3, minHeight: "600px" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>#</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell align="right">
                      ₹{item.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell sx={{ p: 1 }} colSpan={5} align="right">
                    <Typography variant="h6">Bill Total:</Typography>
                  </TableCell>
                  <TableCell sx={{ p: 1 }} align="right">
                    <Typography variant="h6">₹{total.toFixed(2)}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ p: 1 }} colSpan={5} align="right">
                    <Typography variant="body1">Previous Balance:</Typography>
                  </TableCell>
                  <TableCell sx={{ p: 1 }}>
                    <Typography variant="body1" align="right">
                      {invoiceData.previousBalance}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ p: 1 }} colSpan={5} align="right">
                    <Typography variant="body1">Total Balance:</Typography>
                  </TableCell>
                  <TableCell sx={{ p: 1 }}>
                    <Typography variant="body1" align="right">
                      ₹{finalBalance.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Divider sx={{ marginTop: 3 }} />
          <Box sx={{ marginTop: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={8}>
                <Typography variant="h6">Bank Details</Typography>
                <Typography variant="body2">
                  Bank Name: {invoiceData.bankDetails.bankName}
                </Typography>
                <Typography variant="body2">
                  Account Number: {invoiceData.bankDetails.accountNumber}
                </Typography>
                <Typography variant="body2">
                  IFSC: {invoiceData.bankDetails.ifsc}
                </Typography>
                <Typography variant="body2">
                  UPI ID: {invoiceData.bankDetails.upiId}
                </Typography>
                <Typography variant="body2">
                  Mobile Numbers:{" "}
                  {invoiceData.bankDetails.mobileNumbers.join(", ")}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Box display="flex" justifyContent="center">
                  <img
                    src={invoiceData.bankDetails.qrCode}
                    alt="QR Code for UPI Payment"
                    style={{ height: 125 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ marginTop: 3 }} />
          <Typography variant="body1" align="center" sx={{ marginTop: 2 }}>
            Thank you for your business!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
});

export default Invoice;
