import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Toast configuration
  const toastConfig = {
    position: "top-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored"
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      
      if (response.success === false) {
        // Show error toast immediately for failed login
        toast.error(response.message, toastConfig);
        return;
      }

      // Show success toast and wait for it to complete before navigating
      toast.success("Login successful!", toastConfig);
      
      // Reduced delay for better UX
      setTimeout(() => {
        const from = (location.state as any)?.from?.pathname || 
          (response.data?.user?.userType === 'Admin' ? '/useroverview' : '/overview');
        navigate(from, { replace: true });
      }, 2000); // Reduced from 10000 to 2000ms

    } catch (error: any) {
      // Handle specific error messages
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage, toastConfig);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#F9F9F9", minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
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
              variant="outlined"
              size="small"
              required
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
              size="small"
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

      {/* Updated ToastContainer configuration */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Box>
  );
};

export default Login;
