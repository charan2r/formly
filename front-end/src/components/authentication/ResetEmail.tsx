import React, { useState } from "react";

const ResetEmail = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <h2 style={styles.title}>Form.M</h2>
        </div>
        {/* Message Section */}
        <div style={styles.message}>
          <h3 style={styles.messageTitle}>Password Reset Request</h3>
          <p style={styles.messageText}>
            Hello, we received a request to reset your password. If you made this
            request, click the button below to securely set a new password.
          </p>
        </div>
        {/* Reset Button */}
        <button
          style={isHovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Reset Password
        </button>
        {/* Footer Section */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            If you didn’t request a password reset, please ignore this email or
            contact support if you have concerns.
          </p>
          <p style={styles.footerText}>
            Thank you,
            <br />
            <strong>Team Form.M</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  container: {
    margin: 0,
    padding: 0,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "420px",
    maxWidth: "90%",
    padding: "32px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "450px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    marginBottom: "26px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
  },
  message: {
    textAlign: "left",
    marginBottom: "16px",
  },
  messageTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  messageText: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.5",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "40px",
    height: "45px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease",
    marginTop: "-4px",
  },
  buttonHover: {
    backgroundColor: "#333",
    transform: "scale(1.02)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  footer: {
    textAlign: "left",
    fontSize: "13px",
    color: "#777",
  },
  footerText: {
    marginBottom: "28px",
    marginTop: "20px",
  },
};

export default ResetEmail;
