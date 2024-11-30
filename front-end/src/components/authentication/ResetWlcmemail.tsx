import React from "react";

const ResetWlcmemail = () => {
  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "32px",
          textAlign: "center",
          width: "390px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "470px",
        }}
      >
        {/* Title */}
        <div
          style={{
            marginBottom: "24px",
            marginTop: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0",
            }}
          >
            Form.M
          </h2>
        </div>

        {/* Message Section */}
        <div
          style={{
            textAlign: "left",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              marginBottom: "8px",
            }}
          >
            Welcome to our Form.M
          </h3>
          <p
            style={{
              marginTop: "8px",
              fontSize: "14px",
              color: "#555",
              lineHeight: "1.5",
            }}
          >
            Thank you for joining us! We're excited to have you on board and
            look forward to working together. To proceed, please click below
            link to set a password.
          </p>
        </div>

        {/* Button */}
        <button
          style={{
            backgroundColor: "black",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "40px",
            height: "45px",
            width: "100%",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#333";
            e.target.style.transform = "scale(1.02)";
            e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "black";
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
          }}
        >
          Reset Password
        </button>

        {/* Footer Section */}
        <div
          style={{
            textAlign: "left",
            marginTop: "24px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#777",
              marginBottom: "12px",
            }}
          >
            If you have any questions, feel free to contact our support team.
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#777",
              marginTop: "8px",
            }}
          >
            Thank you, <br />
            <strong>Team Form.M</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetWlcmemail;
