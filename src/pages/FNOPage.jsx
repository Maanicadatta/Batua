// src/pages/FNOPage.jsx
import React, { useState } from "react";
import {
  tradePageStyle,
  tradeContentStyle,
  tradeTabBarStyle,
  makeTradeTabStyle,
} from "../styles/tradePageStyles";

/**
 * Sub-tabs shown under the main "F&O" page
 */
const TAB_NAMES = [
  "F&O",
  "Portfolio",
  "Suggestions",
  "Orders",
  "Watchlist",
  "Features",
];

export default function FNOPage() {
  const [activeTab, setActiveTab] = useState("F&O");

  return (
    <div style={tradePageStyle}>
      <div style={tradeContentStyle}>
        {/* Main heading */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "12px",
          }}
        >
          F&amp;O
        </h1>

        {/* Sub-tab bar */}
        <div style={tradeTabBarStyle}>
          {TAB_NAMES.map((name) => (
            <button
              key={name}
              style={makeTradeTabStyle(activeTab, name)}
              onClick={() => setActiveTab(name)}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        {renderActiveTabContent(activeTab)}
      </div>
    </div>
  );
}

/* ---------- Tab content renderers ---------- */

function renderActiveTabContent(activeTab) {
  switch (activeTab) {
    case "F&O":
      return renderFNOTab();
    case "Portfolio":
      return renderPortfolioTab();
    case "Suggestions":
      return renderSuggestionsTab();
    case "Orders":
      return renderOrdersTab();
    case "Watchlist":
      return renderWatchlistTab();
    case "Features":
      return renderFeaturesTab();
    default:
      return null;
  }
}

/* F&O tab – same layout as Stocks tab */
function renderFNOTab() {
  const searchRow = {
    display: "flex",
    alignItems: "center",
    borderRadius: "24px",
    border: "2px solid #000",
    backgroundColor: "#fff",
    padding: "6px 10px",
    marginBottom: "16px",
  };

  const searchInput = {
    border: "none",
    outline: "none",
    fontSize: "14px",
    flex: 1,
  };

  const filterIcon = {
    marginLeft: "8px",
    fontSize: "20px",
  };

  const listItem = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "8px",
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>F&amp;O</h2>

      <div style={searchRow}>
        <span style={{ fontSize: "18px", marginRight: "8px" }}>🔍</span>
        <input
          style={searchInput}
          placeholder="Search contract or symbol"
          type="text"
        />
        <span style={filterIcon}>⚙️</span>
      </div>

      <div>
        <div style={listItem}>Top Traded Contracts</div>
        <div style={listItem}>Highest OI</div>
        <div style={listItem}>Most Volatile</div>
        <div style={listItem}>Expiring This Week</div>
        <div style={listItem}>Index Futures</div>
        <div style={listItem}>Stock Options</div>
        <div style={listItem}>Strategies</div>
        <div style={listItem}>Rollovers</div>
      </div>
    </div>
  );
}

/* Portfolio tab – copy of Stocks portfolio tab */
function renderPortfolioTab() {
  const card = {
    backgroundColor: "#fff",
    borderRadius: "18px",
    border: "2px solid #b5c7f2",
    padding: "16px",
    marginBottom: "16px",
  };

  const sectionTitle = {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "8px",
  };

  const label = {
    fontSize: "16px",
    marginBottom: "4px",
  };

  const chartBox = {
    marginTop: "12px",
    height: "220px",
    borderRadius: "18px",
    border: "2px solid #b5c7f2",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const periodRow = {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    marginTop: "16px",
    fontWeight: 700,
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Portfolio</h2>

      <div style={card}>
        <div style={sectionTitle}>My Positions</div>
        <div
          style={{
            ...card,
            marginBottom: 0,
            borderRadius: "18px",
            border: "2px solid #000",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={label}>Open Positions (5)</div>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>
                ₹ 5,67,643
              </div>
            </div>
            <div style={{ fontSize: "36px" }}>📈</div>
          </div>
          <div style={{ marginTop: "12px" }}>
            <div style={label}>1D P&amp;L</div>
            <div style={label}>Total P&amp;L</div>
            <div style={label}>Margin Used</div>
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Total Value</div>
        <div style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
          ₹ 5,67,643
        </div>
        <div style={label}>Loss</div>
        <div style={label}>Profit</div>

        <div style={chartBox}>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: 8 }}>
            Change%
          </div>
          <div style={{ fontSize: "14px", opacity: 0.6 }}>Chart placeholder</div>
          <div style={periodRow}>
            <span>W</span>
            <span>M</span>
            <span>3M</span>
            <span>6M</span>
            <span>Y</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Suggestions tab */
function renderSuggestionsTab() {
  const card = {
    backgroundColor: "#d2e4ff",
    borderRadius: "18px",
    padding: "14px 18px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "18px",
    fontWeight: 700,
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Suggestions</h2>

      <div style={card}>
        <span>Strategy 1</span>
        <span>➤</span>
      </div>
      <div style={card}>
        <span>Strategy 2</span>
        <span>➤</span>
      </div>
      <div style={card}>
        <span>Strategy 3</span>
        <span>➤</span>
      </div>
    </div>
  );
}

/* Orders tab */
function renderOrdersTab() {
  const itemStyle = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "10px",
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Orders</h2>

      <div style={itemStyle}>Open Orders</div>
      <div style={itemStyle}>Executed Orders</div>
      <div style={itemStyle}>Cancelled Orders</div>
    </div>
  );
}

/* Watchlist tab */
function renderWatchlistTab() {
  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Watchlist</h2>
      <p style={{ textAlign: "center" }}>
        Your F&amp;O watchlist will appear here.
      </p>
    </div>
  );
}

/* Features tab */
function renderFeaturesTab() {
  const itemStyle = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "10px",
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Features</h2>
      <div style={itemStyle}>Option Chain</div>
      <div style={itemStyle}>Strategy Builder</div>
      <div style={itemStyle}>Greeks</div>
      <div style={itemStyle}>Margin Calculator</div>
      <div style={itemStyle}>Expiry Calendar</div>
    </div>
  );
}
