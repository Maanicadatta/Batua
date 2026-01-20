// src/pages/PaymentsPage.jsx
import React from "react";

const PaymentsPage = () => {
  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
    display: "flex",
    justifyContent: "center",
    paddingTop: "80px", // space below sticky header
    paddingBottom: "40px",
  };

  const contentStyle = {
    width: "100%",
    maxWidth: "420px",
    padding: "16px",
  };

  const cardStyle = {
    backgroundColor: "#d2e4ff",
    borderRadius: "18px",
    padding: "16px 20px",
    textAlign: "center",
    marginBottom: "16px",
  };

  const pillRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "16px",
  };

  const smallCardStyle = {
    flex: 1,
    backgroundColor: "#d2e4ff",
    borderRadius: "18px",
    padding: "16px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  };

  const subTextStyle = {
    fontSize: "16px",
    fontWeight: "500",
    margin: 0,
  };

  const pillInputRow = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "24px",
    border: "2px solid #000",
    backgroundColor: "#fff",
    padding: "8px 14px",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "16px",
  };

  const copyButtonStyle = {
    borderRadius: "50%",
    border: "2px solid #000",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  };

  const qrCardStyle = {
    backgroundColor: "#d2e4ff",
    borderRadius: "18px",
    padding: "20px",
    textAlign: "center",
    marginBottom: "16px",
  };

    const qrBoxStyle = {
    width: '220px',
    height: '220px',
    margin: '0 auto 12px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '2px solid #b5c7f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  };


  const iconRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "16px",
  };

  const iconCardStyle = {
    flex: 1,
    backgroundColor: "#d2e4ff",
    borderRadius: "18px",
    padding: "10px 6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: 600,
    textAlign: "center",
  };

  const roundButton = {
    width: "100%",
    backgroundColor: "#d2e4ff",
    borderRadius: "24px",
    border: "none",
    padding: "14px 10px",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "16px",
    cursor: "pointer",
  };

  const ctaButton = {
    width: "100%",
    borderRadius: "24px",
    border: "2px solid #000",
    padding: "12px 16px",
    fontSize: "16px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginBottom: "12px",
    cursor: "pointer",
  };

  const dotRowStyle = {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
    marginBottom: "16px",
  };

  const dotStyle = {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    backgroundColor: "#1555a8",
  };

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        {/* Reminder */}
        <div style={cardStyle}>
          <div
            style={{ fontSize: "22px", fontWeight: "700", marginBottom: "4px" }}
          >
            Reminder
          </div>
          <p style={subTextStyle}>
            You have Rs 1000 left to spend this month
          </p>
        </div>

        {/* Scan / Pay row */}
        <div style={pillRowStyle}>
          <div style={smallCardStyle}>
            <div style={{ fontSize: "28px", marginBottom: "4px" }}>📷</div>
            <div>Scan any</div>
            <div>QR code</div>
          </div>
          <div style={smallCardStyle}>
            <div style={{ fontSize: "28px", marginBottom: "4px" }}>💸</div>
            <div>Pay</div>
            <div>Anyone</div>
          </div>
        </div>

        {/* UPI ID row */}
        <div style={pillInputRow}>
          <span>
            <strong>UPI ID:</strong> buck@okicici
          </span>
          <button style={copyButtonStyle}>⧉</button>
        </div>

        {/* QR block */}
        <div style={qrCardStyle}>
          <div style={qrBoxStyle}>QR CODE</div>
          <div style={{ fontSize: "18px", fontWeight: "700" }}>
            Receive Payments
          </div>
        </div>

        {/* UPI Phone row */}
        <div style={pillInputRow}>
          <span>
            <strong>UPI Phone:</strong> +91 8374928574
          </span>
          <button style={copyButtonStyle}>⧉</button>
        </div>

        {/* Bank / Recharge / Tap row */}
        <div style={iconRowStyle}>
          <div style={iconCardStyle}>
            <div style={{ fontSize: "26px", marginBottom: "6px" }}>🏦</div>
            <div>Bank</div>
            <div>Transfer</div>
          </div>
          <div style={iconCardStyle}>
            <div style={{ fontSize: "26px", marginBottom: "6px" }}>📱</div>
            <div>Mobile</div>
            <div>Recharge</div>
          </div>
          <div style={iconCardStyle}>
            <div style={{ fontSize: "26px", marginBottom: "6px" }}>💳</div>
            <div>Tap and</div>
            <div>Pay</div>
          </div>
        </div>

        {/* Premium button */}
        <button style={roundButton}>Try Batua Premium</button>

        {/* Offers & rewards */}
        <div
          style={{
            marginBottom: "8px",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          Offers and Rewards
        </div>
        <div style={dotRowStyle}>
          <div style={dotStyle} />
          <div style={dotStyle} />
          <div style={dotStyle} />
          <div style={dotStyle} />
        </div>

        {/* CTAs */}
        <button style={ctaButton}>
          <span>See Transaction History</span>
          <span>➤</span>
        </button>
        <button style={ctaButton}>
          <span>Check Bank Balance</span>
          <span>➤</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentsPage;
