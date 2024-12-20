import React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; 
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const ResetPassword = () => {
  return (
    <Box
      sx={{
        backgroundColor: "F9F9F9", 
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Navbar */}
      <Box
        component="nav"
        sx={{
          position: "absolute",
          top: 8,
          left: 16,
          right: 16,
          backgroundColor: "F9F9F9",
          border: "2px solid black", 
          borderRadius: "40px", 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px 8px", 
          height: "45px", 
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "black",
            fontSize: "1rem", 
          }}
        >
          Forms.M
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Button
            variant="text"
            sx={{
              fontWeight: "bold",
              color: "black",
              textTransform: "none", 
              fontSize: "0.8rem", 
              padding: "2px 6px", 
            }}
          >
            Products
          </Button>
          <Button
            variant="text"
            sx={{
              fontWeight: "bold",
              color: "black",
              textTransform: "none",
              fontSize: "0.8rem", 
              padding: "2px 6px",
            }}
          >
            Pricing
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "0.8rem", 
              borderRadius: "40px", 
              padding: "4px 8px", 
            }}
          >
            Login
          </Button>
        </Box>
      </Box>

      {/* Login Card */}
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: 3,
          padding: "32px",
          position: "relative",
          textAlign: "center",
          height: "360px", 
          display: "flex",
          width: "370px",
          flexDirection: "column",
          justifyContent: "space-between", 
        }}
      >
        {/* Back Arrow */}
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: "#fff",
            borderRadius: "50%",
            padding: "4px",
          }}
          onClick={() => window.history.back()} 
        >
          <ArrowBackIcon />
        </IconButton>

       {/* Logo and Title */}
       <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mb: 6,
            mt: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Icon */}
          <HighlightOffIcon fontSize="large" sx={{ color: "black" }} />
          {/* Title */}
          <Typography variant="h5" fontWeight="bold">
            Form.M
          </Typography>
        </Stack>


        {/* New Typography message */}
        <Box sx={{ textAlign: "left", marginBottom: 3, marginTop: -2 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Forgot your password?{" "}
          </Typography>
          <Typography
            component="span"
            sx={{
              display: "block",
              marginTop: 0.5, 
              fontWeight: "normal",
              fontSize: "13px",
            }}
          >
            Don’t worry, happens to all of us. Enter your email below to recover
            your password.
          </Typography>
        </Box>

        {/* Email Field */}
        <Box sx={{ textAlign: "left", marginTop: 1 }}>
          <Typography
            variant="caption"
            gutterBottom
            sx={{ marginBottom: "2px", marginTop: "-20px", display: "block" }} 
          >
            Email *
          </Typography>
          <TextField
            name="email"
            type="email"
            placeholder="Enter your email"
            fullWidth
            required
            InputProps={{
              sx: {
                backgroundColor: "#f9f9f9",
                borderRadius: "5px",
                paddingY: "2px",
                height: "30px",
              },
            }}
          />
        </Box>

        {/* Login Button */}
        <Box sx={{ marginTop: 3, mb: -1 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
              borderRadius: "40px",
              paddingY: "4px",
              height: "35px",
            }}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;
