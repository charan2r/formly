import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const Login = () => {
  const [password, setPassword] = useState("");

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
          height: "350px",
          display: "flex",
          width: "400px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Logo and Title */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mb: 6,
            mt: 2,
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

        {/* Email Field */}
        <Box sx={{ textAlign: "left", mt: -3 }}>
          <Typography
            variant="caption"
            gutterBottom
            sx={{ marginBottom: "4px", display: "block" }}
          >
            Email *
          </Typography>
          <TextField
            name="email"
            placeholder="Enter your username"
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

        {/* Password Field */}
        <Box sx={{ textAlign: "left", marginTop: 2 }}>
          <Typography
            variant="caption"
            gutterBottom
            sx={{ marginBottom: "4px", display: "block" }}
          >
            Password *
          </Typography>
          <TextField
            name="password"
            type="password"
            placeholder="Enter your password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <Box sx={{ marginTop: 4 }}>
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
            Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
