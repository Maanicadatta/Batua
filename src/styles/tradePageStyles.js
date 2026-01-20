// src/styles/tradePageStyles.js

// Outer page (background + top/bottom padding)
export const tradePageStyle = {
  minHeight: "100vh",
  backgroundColor: "#f7f7f7",
  paddingTop: "80px",      // space for sticky top nav
  paddingBottom: "40px",
};

// Centered content container (desktop-friendly)
export const tradeContentStyle = {
  width: "100%",
  maxWidth: "960px",
  margin: "0 auto",
  padding: "24px 40px",
};

// Blue pill tab bar (same for Stocks / MF / F&O)
export const tradeTabBarStyle = {
  display: "flex",
  backgroundColor: "#d2e4ff",
  borderRadius: "999px",    // pill bar
  padding: "8px 16px",
  margin: "8px auto 24px",  // centered under heading
  maxWidth: "640px",        // wide enough for all tab names
};

// Individual tab button style
export const makeTradeTabStyle = (activeTab, tab) => ({
  flex: 1,
  minWidth: "70px",
  padding: "8px 10px",
  marginRight: "6px",
  borderRadius: "18px",
  border: "none",
  backgroundColor: activeTab === tab ? "#ffffff" : "transparent",
  fontWeight: 600,
  fontSize: "12px",
  cursor: "pointer",
  whiteSpace: "nowrap",
});
