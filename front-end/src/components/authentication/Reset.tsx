import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  List,
  Stack,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const Reset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Password validation rules
  const validations = {
    minLength: newPassword.length > 8,
    hasDigit: /\d/.test(newPassword),
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    passwordsMatch: newPassword === confirmPassword && newPassword !== "",
  };

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
          height: "410px",
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

        <Box sx={{ textAlign: "left", mb: 2, mt: -5 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Set your password
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            Please set a new password for your account
          </Typography>
        </Box>

        {/* New Password Field */}
        <Box sx={{ textAlign: "left", position: "relative", mt: -2 }}>
          <Typography
            variant="caption"
            gutterBottom
            sx={{ marginBottom: "4px", display: "block" }}
          >
            New Password *
          </Typography>
          <TextField
            name="newPassword"
            type="password"
            placeholder="Enter your new password"
            fullWidth
            value={newPassword}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            onChange={(e) => setNewPassword(e.target.value)}
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

          {/* Password Validation Card */}
          {(isPasswordFocused || newPassword) && (
            <Card
              sx={{
                position: "absolute",
                top: "70px",
                left: 0,
                width: "100%",
                padding: "8px",
                boxShadow: 3,
                zIndex: 10,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                New password must include:
              </Typography>
              <List dense>
                {Object.entries(validations).map(([key, valid]) => (
                  <ListItem key={key}>
                    <ListItemIcon>
                      {valid ? (
                        <CheckCircleIcon sx={{ color: "green" }} />
                      ) : (
                        <ErrorIcon sx={{ color: "red" }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        key === "minLength"
                          ? "More than 8 characters."
                          : key === "hasDigit"
                          ? "At least 1 digit."
                          : key === "hasUpperCase"
                          ? "Minimum 1 capital letter in password."
                          : key === "hasSpecialChar"
                          ? "Minimum 1 special character (e.g., @, #, $)."
                          : key === "passwordsMatch"
                          ? "Password should be match with confirm password."
                          : ""
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </Box>

        {/* Confirm Password Field */}
        <Box sx={{ textAlign: "left", marginTop: 0 }}>
          <Typography
            variant="caption"
            gutterBottom
            sx={{ marginBottom: "4px", display: "block" }}
          >
            Confirm Password *
          </Typography>
          <TextField
            name="confirmPassword"
            type="password"
            placeholder="Enter your confirm password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

        {/* Set Password Button */}
        <Box sx={{ marginTop: 2 }}>
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
            Set Password
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Reset;
