// src/pages/MutualFundsPage.jsx
import React, { useState } from "react";
import {
  tradePageStyle,
  tradeContentStyle,
  tradeTabBarStyle,
  makeTradeTabStyle,
} from "../styles/tradePageStyles";

const tabs = [
  "Funds",
  "Portfolio",
  "Suggestions",
  "Watchlist",
  "Transactions",
  "Features",
];

export default function MutualFundsPage() {
  const [activeTab, setActiveTab] = useState("Funds");

 

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "16px 18px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: "16px",
  };

  const searchRowStyle = {
    display: "flex",
    alignItems: "center",
    borderRadius: "999px",
    border: "2px solid #000",
    padding: "6px 10px",
    marginBottom: "20px",
  };

  const searchInputStyle = {
    border: "none",
    outline: "none",
    flex: 1,
    marginLeft: "8px",
    fontSize: "14px",
  };

  const pillListText = {
    textAlign: "center",
    fontWeight: 700,
    lineHeight: 1.8,
    fontSize: "18px",
  };

  const suggestionsButton = {
    width: "100%",
    borderRadius: "18px",
    border: "none",
    padding: "12px 14px",
    backgroundColor: "#d2e4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: 600,
    fontSize: "16px",
    marginBottom: "10px",
    cursor: "pointer",
  };

  const sectionTitle = {
    fontSize: "20px",
    fontWeight: "700",
    margin: "16px 0 10px",
    textAlign: "center",
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Funds":
        return (
          <>
            <h2 style={sectionTitle}>Mutual Funds</h2>

            {/* search bar */}
            <div style={searchRowStyle}>
              <span role="img" aria-label="search">
                🔍
              </span>
              <input
                style={searchInputStyle}
                placeholder="Search MF"
                type="text"
              />
              <span role="img" aria-label="filter">
                ⚙️
              </span>
            </div>

            {/* list of ideas */}
            <div style={cardStyle}>
              <div style={pillListText}>
                <div>Popular Funds</div>
                <div>High Return</div>
                <div>Best SIP’s</div>
                <div>large cap</div>
                <div>mid cap</div>
                <div>small cap</div>
                <div>NFO’s</div>
              </div>
            </div>
          </>
        );

      case "Portfolio":
        return (
          <>
            <h2 style={sectionTitle}>Portfolio</h2>

            {/* Holdings card */}
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                <span>Holdings(6)</span>
                <span role="img" aria-label="chart">
                  📈
                </span>
              </div>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>
                $ 5,676,433
              </div>
              <div style={{ marginTop: "10px", lineHeight: 1.8 }}>
                <div>1D Returns</div>
                <div>Total Returns</div>
                <div>Invested</div>
                <div>XIRR</div>
              </div>
            </div>

            {/* Total value + change chart placeholder */}
            <div style={cardStyle}>
              <div style={{ fontWeight: 700, marginBottom: "6px" }}>
                Total Value
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700 }}>
                $ 5,676,433
              </div>
              <div style={{ marginTop: "12px" }}>Loss</div>
              <div>Profit</div>

              <div
                style={{
                  marginTop: "18px",
                  borderRadius: "18px",
                  border: "2px solid #d2e4ff",
                  padding: "14px 10px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "8px" }}>
                  Change%
                </div>
                {/* simple chart placeholder */}
                <div
                  style={{
                    height: "120px",
                    borderRadius: "12px",
                    border: "1px solid #ccd8ff",
                  }}
                >
                  {/* you can plug a real chart here later */}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                    fontWeight: 700,
                  }}
                >
                  <span>W</span>
                  <span>M</span>
                  <span>3M</span>
                  <span>6M</span>
                  <span>Y</span>
                </div>
              </div>
            </div>
          </>
        );

      case "Suggestions":
        return (
          <>
            <h2 style={sectionTitle}>Suggestions</h2>

            <button style={suggestionsButton}>
              <span>Suggestion 1</span>
              <span>➤</span>
            </button>
            <button style={suggestionsButton}>
              <span>Suggestion 2</span>
              <span>➤</span>
            </button>
            <button style={suggestionsButton}>
              <span>Suggestion 3</span>
              <span>➤</span>
            </button>

            <h3
              style={{
                marginTop: "24px",
                marginBottom: "8px",
                fontSize: "18px",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Transactions
            </h3>
            <div style={cardStyle}>
              <div>• 2 Jan – Buy – ABC Growth Fund – ₹10,000</div>
              <div>• 8 Jan – SIP – XYZ Index – ₹5,000</div>
              <div>• 15 Jan – Sell – DEF Value Fund – ₹7,500</div>
            </div>
          </>
        );

      case "Watchlist":
        return (
          <>
            <h2 style={sectionTitle}>Watchlist</h2>
            <div style={cardStyle}>
              <div>• ABC Flexi Cap Fund</div>
              <div>• XYZ Midcap Fund</div>
              <div>• DEF Index Fund</div>
            </div>
          </>
        );

      case "Transactions":
        return (
          <>
            <h2 style={sectionTitle}>Transactions</h2>
            <div style={cardStyle}>
              <div>1 Jan – Buy – ABC Flexi Cap – ₹10,000</div>
              <div>5 Jan – SIP – XYZ Index – ₹5,000</div>
              <div>10 Jan – Switch – DEF Debt → DEF Hybrid – ₹15,000</div>
            </div>
          </>
        );

      case "Features":
        return (
          <>
            <h2 style={sectionTitle}>Segments</h2>
            <div style={cardStyle}>
              <div style={pillListText}>
                <div>large cap</div>
                <div>mid cap</div>
                <div>small cap</div>
                <div>NFO’s</div>
                <div>SIP</div>
                <div>Gold Funds</div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

    return (
    <div style={tradePageStyle}>
      <div style={tradeContentStyle}>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "4px",
          }}
        >
          Mutual Funds
        </h1>

                {/* top tab bar */}
        <div style={tradeTabBarStyle}>
          {tabs.map((tab) => (
            <button
              key={tab}
              style={makeTradeTabStyle(activeTab, tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>


        {renderTabContent()}
      </div>
    </div>
  );
}
