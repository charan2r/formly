import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { setAccessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        // Store token in global state
        setAccessToken(response.data.data.accessToken);
        
        // Show success toast
        setToast({
          open: true,
          message: "Login successful!",
          severity: "success"
        });

        // Navigate after a short delay
        setTimeout(() => {
          const from = (location.state as any)?.from?.pathname || "/overview";
          navigate(from, { replace: true });
        }, 1000);
      } else {
        // Show error toast
        setToast({
          open: true,
          message: response.data.message || "Login failed",
          severity: "error"
        });
      }
    } catch (error: any) {
      // Show error toast
      setToast({
        open: true,
        message: error.response?.data?.message || "Login failed",
        severity: "error"
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F9F9F9",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Navbar */}
      <Box
        component="nav"
        sx={{
          position: "fixed",
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
          zIndex: 1000,
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

      {/* Main content wrapper */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "400px",
          padding: "0 20px",
        }}
      >
        {/* Login Card */}
        <Container
          component="form"
          onSubmit={handleLogin}
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: 3,
            padding: "32px",
            position: "relative",
            textAlign: "center",
            height: "350px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: 0,
            width: "100%",
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
              sx={{ 
                marginBottom: "4px", 
                display: "block",
                color: "#666",
                fontWeight: 500,
                fontSize: "0.75rem",
                letterSpacing: "0.03em"
              }}
            >
              Email *
            </Typography>
            <TextField
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                  }
                }
              }}
              InputProps={{
                sx: {
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#FAFAFA",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                    transition: "all 0.2s"
                  },
                  "&:hover fieldset": {
                    borderColor: "#000",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#000",
                    borderWidth: "2px"
                  },
                },
              }}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ textAlign: "left", marginTop: 2 }}>
            <Typography
              variant="caption" 
              gutterBottom
              sx={{ 
                marginBottom: "4px", 
                display: "block",
                color: "#666",
                fontWeight: 500,
                fontSize: "0.75rem",
                letterSpacing: "0.03em"
              }}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                  }
                }
              }}
              InputProps={{
                sx: {
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#FAFAFA",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                    transition: "all 0.2s"
                  },
                  "&:hover fieldset": {
                    borderColor: "#000",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#000",
                    borderWidth: "2px"
                  },
                },
              }}
            />
          </Box>

          {/* Login Button */}
          <Box sx={{ marginTop: 4 }}>
            <Button
              type="submit"
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

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toast.severity}
          sx={{ 
            width: '100%',
            backgroundColor: toast.severity === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
