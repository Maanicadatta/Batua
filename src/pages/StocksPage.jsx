// src/pages/InvestingPage.jsx
import React, { useEffect, useState } from "react";
import StockChart from "../components/StockChart";
import {
  tradePageStyle,
  tradeContentStyle,
  tradeTabBarStyle,
  makeTradeTabStyle,
} from "../styles/tradePageStyles";
const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:5050";


/**
 * Sub-tabs shown under the main "Stocks" page
 */
const TAB_NAMES = [
  "Stocks",
  "Portfolio",
  "Suggestions",
  "Orders",
  "Watchlist",
  "Features",
];

export default function StocksPage() {
  const [activeTab, setActiveTab] = useState("Stocks");

  return (
    <div style={tradePageStyle}>
      <div style={tradeContentStyle}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "12px",
          }}
        >
          Stocks
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

        {renderActiveTabContent(activeTab)}
      </div>
    </div>
  );
}

/* ---------- Tab content renderers ---------- */

function renderActiveTabContent(activeTab) {
  switch (activeTab) {
    case "Stocks":
      return <StocksTab />;
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

/* ===================== Stocks tab ===================== */
const TIMEFRAMES = [
  { label: "1D", range: "1d", interval: "5m" },
  { label: "5D", range: "5d", interval: "15m" },
  { label: "1M", range: "1mo", interval: "1h" },
  { label: "3M", range: "3mo", interval: "1d" },
  { label: "6M", range: "6mo", interval: "1d" },
  { label: "YTD", range: "ytd", interval: "1d" },
  { label: "1Y", range: "1y", interval: "1d" },
  { label: "5Y", range: "5y", interval: "1wk" },
  { label: "ALL", range: "max", interval: "1mo" },
];

const RECENTLY_VIEWED_STORAGE_KEY = "recentlyViewedStocks";

const RECENTLY_VIEWED_PLACEHOLDERS = [
  { slot: 0 },
  { slot: 1 },
  { slot: 2 },
  { name: "See more", isSeeMore: true },
];

function StocksTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockDetails, setStockDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [tf, setTf] = useState(TIMEFRAMES[6]); // default 1Y
  const [candles, setCandles] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const pushRecentlyViewed = (stock, details) => {
    // Build a clean object for the tiles
    const payload = {
  ticker_symbol: stock?.ticker_symbol,
  company_name: stock?.company_name,
  exchange: stock?.exchange,     // ✅ add
  country: stock?.country,       // optional
  currency: stock?.currency,     // optional
  last_price: details?.last_price,
  change: details?.change,
  change_pct: details?.change_pct,
};

    setRecentlyViewed((prev) => {
      const withoutDupes = prev.filter(
  (s) =>
    !(
      s.ticker_symbol === payload.ticker_symbol &&
      (s.exchange || "") === (payload.exchange || "")
    )
);

      const next = [payload, ...withoutDupes].slice(0, 3);
      localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

 const fetchCandles = async (ticker, exchange, range, interval) => {
  setChartLoading(true);
  try {
    const url = `${API_BASE}/api/stocks/history?symbol=${encodeURIComponent(
      ticker
    )}&exchange=${encodeURIComponent(exchange || "")}&range=${encodeURIComponent(
      range
    )}&interval=${encodeURIComponent(interval)}`;

    const res = await fetch(url);
    if (!res.ok) return;

    const data = await res.json();
    setCandles(Array.isArray(data) ? data : []);
  } finally {
    setChartLoading(false);
  }
};



  const searchRow = {
    display: "flex",
    alignItems: "center",
    borderRadius: "24px",
    border: "2px solid #000",
    backgroundColor: "#fff",
    padding: "6px 10px",
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

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: "4px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #000",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    maxHeight: "260px",
    overflowY: "auto",
    zIndex: 20,
  };

  const dropdownItemStyle = {
    width: "100%",
    textAlign: "left",
    padding: "8px 12px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
  };

  const dropdownItemSecondary = {
    fontSize: "12px",
    color: "#16a34a", // green
    fontWeight: 600,
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setShowDropdown(false);
      setLastQuery("");
      return;
    }

    if (trimmed === lastQuery) {
      return;
    }

    setLoading(true);
    setShowDropdown(true);
    setLastQuery(trimmed);

    try {
      const url = `${API_BASE}/api/stocks/search?q=${encodeURIComponent(trimmed)}`;


      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Stock search error:", res.status, text);
        setResults([]);
        return;
      }

      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error calling stock_search:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

const fetchStockDetails = async (ticker, exchange, selected) => {
  setDetailsLoading(true);
  setStockDetails(null);

  try {
    const url = `${API_BASE}/api/stocks/details?symbol=${encodeURIComponent(
      ticker
    )}&exchange=${encodeURIComponent(exchange || "")}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Stock details error:", res.status, text);
      return;
    }

    const data = await res.json();
    setStockDetails(data);

    // ✅ store in "Recently Viewed" after we have details (price/change)
    if (selected) {
      pushRecentlyViewed(selected, data);
    }
  } catch (err) {
    console.error("Error fetching stock details:", err);
  } finally {
    setDetailsLoading(false);
  }
};


 const handleSelectStock = (stock) => {
  const label = `${stock.company_name?.trim?.() || stock.company_name} (${stock.ticker_symbol})`;
  setSearchTerm(label);
  setShowDropdown(false);
  setSelectedStock(stock);

  // ✅ fetch details + store in recently viewed (pass exchange)
  fetchStockDetails(stock.ticker_symbol, stock.exchange, stock);

  // chart (pass exchange)
  fetchCandles(stock.ticker_symbol, stock.exchange, tf.range, tf.interval);
};


  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };
useEffect(() => {
  if (!selectedStock?.ticker_symbol) return;

  fetchCandles(selectedStock.ticker_symbol, selectedStock.exchange, tf.range, tf.interval);

  const id = setInterval(() => {
    fetchCandles(selectedStock.ticker_symbol, selectedStock.exchange, tf.range, tf.interval);
  }, 60000);

  return () => clearInterval(id);
}, [selectedStock, tf]);


  /* --- styles for Most bought section --- */
  const mostBoughtWrapper = {
    marginTop: "24px",
  };

  const mostBoughtTitle = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "12px",
  };

  const mostBoughtGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  };

    const mostBoughtCard = {
    borderRadius: "16px",
    padding: "14px 16px",
    backgroundColor: "#ffffff",   // ⬅️ white box
    color: "#111827",             // ⬅️ dark text
    minHeight: "96px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid #E5E7EB",  // subtle border (optional)
    boxShadow: "0 6px 14px rgba(0,0,0,0.04)", // light shadow (optional)
  };

  const mostBoughtName = {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#111827",             // title black
  };

  const mostBoughtPrice = {
    fontSize: "16px",
    fontWeight: 700,
    color: "#111827",             // price black
  };

  const mostBoughtChange = (positive) => ({
    fontSize: "12px",
    fontWeight: 600,
    marginTop: "4px",
    color: positive ? "#16A34A" : "#DC2626", // keep green/red for change
  });

  const seeMoreCardInner = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "6px",
    color: "#111827",             // text black for see-more card
  };


  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Stocks</h2>

      {/* Search + dropdown wrapper */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <div style={searchRow}>
          <span style={{ fontSize: "18px", marginRight: "8px" }}>🔍</span>
          <input
            style={searchInput}
            placeholder="Search Stock or BSE Code"
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onFocus={() => {
              if (results.length > 0) setShowDropdown(true);
            }}
            onBlur={handleBlur}
          />
          <span style={filterIcon}>➤</span>
        </div>

        {showDropdown && (
          <div style={dropdownStyle}>
            {loading && (
              <div style={{ padding: "8px 12px", fontSize: "13px" }}>
                Searching…
              </div>
            )}

            {!loading && results.length === 0 && (
              <div style={{ padding: "8px 12px", fontSize: "13px" }}>
                No matches found
              </div>
            )}

            {!loading &&
              results.map((stock) => (
                <button
                  key={stock.ticker_symbol}
                  type="button"
                  style={dropdownItemStyle}
                  onClick={() => handleSelectStock(stock)}
                >
                  <div style={{ fontWeight: 700 }}>
                    {stock.company_name}
                  </div>
                  <div style={dropdownItemSecondary}>
  {stock.ticker_symbol}{stock.exchange ? ` • ${stock.exchange}` : ""}{stock.country ? ` • ${stock.country}` : ""}
</div>

                </button>
              ))}
          </div>
        )}
      </div>

           {/* Recently Viewed – only show when no stock is selected */}
      {!selectedStock && (
        <div style={mostBoughtWrapper}>
          <div style={mostBoughtTitle}>Recently Viewed</div>

          <div style={mostBoughtGrid}>
            {RECENTLY_VIEWED_PLACEHOLDERS.map((s, idx) => {
              if (s.isSeeMore) {
                return (
                  <div key="see-more" style={mostBoughtCard}>
                    <div style={seeMoreCardInner}>
                      <div style={mostBoughtName}>See more</div>
                      <div style={{ fontSize: "12px", opacity: 0.7 }}>
                        Explore all popular stocks on Batua →
                      </div>
                    </div>
                  </div>
                );
              }

              const item = recentlyViewed[s.slot];

              // Empty placeholder card
              if (!item) {
                return (
                  <div
                    key={`empty-${s.slot}`}
                    style={{
                      ...mostBoughtCard,
                      opacity: 0.45,
                      borderStyle: "dashed",
                    }}
                  >
                    <div style={mostBoughtName}>No recent stock</div>
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>
                      Search and open a stock to see it here
                    </div>
                  </div>
                );
              }

              // Filled card
              const price = item.last_price ? `${item.last_price}` : "";
              const change = item.change_pct
                ? `${item.change ?? ""} (${item.change_pct}%)`
                : "";

              const positive = Number(item.change ?? 0) >= 0;

              return (
                <div
                  key={item.ticker_symbol}
                  style={mostBoughtCard}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
  handleSelectStock({
    company_name: item.company_name,
    ticker_symbol: item.ticker_symbol,
    exchange: item.exchange,     // ✅
    country: item.country,
    currency: item.currency,
  })
}

                >
                  <div style={mostBoughtName}>{item.company_name}</div>

                  <div>
                    <div style={mostBoughtPrice}>
                      {price ? `${price} INR` : ""}
                    </div>
                    <div style={mostBoughtChange(positive)}>{change}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* Stock detail view */}

      {selectedStock && (
        <StockDetailsSection
  selectedStock={selectedStock}
  details={stockDetails}
  loading={detailsLoading}
  tf={tf}
  setTf={setTf}
  candles={candles}
  chartLoading={chartLoading}
/>

      )}
    </div>
  );
}

/* ---- Stock details layout (Nifty-style) ---- */

function StockDetailsSection({
  selectedStock,
  details,
  loading,
  tf,
  setTf,
  candles,
  chartLoading,
}) {
  const wrapper = {
    marginTop: "8px",
    padding: "16px",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  };

  const headerRow = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
  };

  const circle = {
    width: "72px",
    height: "72px",
    borderRadius: "999px",
    backgroundColor: "#111b5c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: 700,
  };

  const priceRow = {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    marginTop: "8px",
  };

  const priceText = {
    fontSize: "32px",
    fontWeight: 700,
  };

  const changeText = (isPositive) => ({
    fontSize: "16px",
    fontWeight: 600,
    color: isPositive ? "#16a34a" : "#b91c1c",
  });

  const sectionTitle = {
    fontSize: "18px",
    fontWeight: 700,
    margin: "20px 0 8px",
  };

  const card = {
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "12px 16px",
    backgroundColor: "#f9fafb",
  };

  const twoCol = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  };

  const label = { fontSize: "13px", color: "#6b7280" };
  const value = { fontSize: "15px", fontWeight: 600 };

  const techRow = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
  };

  // fallbacks if details not loaded yet
  const lastPrice = details?.last_price ?? "—";
  const absChange = details?.change ?? 0;
  const pctChange = details?.change_pct ?? 0;
  const isPositive = Number(absChange) >= 0;

  return (
    <div style={wrapper}>
      {/* Header */}
      <div style={headerRow}>
        <div style={circle}>
          {/* first 2 letters as an icon */}
          {selectedStock.company_name.trim().slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: "22px", fontWeight: 700 }}>
            {selectedStock.company_name.trim()}
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            {selectedStock.ticker_symbol}
          </div>

          <div style={priceRow}>
            <span style={priceText}>{lastPrice} INR</span>
            <span style={changeText(isPositive)}>
              {absChange} {pctChange ? `(${pctChange}%)` : ""}
            </span>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ fontSize: "14px", color: "#6b7280" }}>
          Loading stock details…
        </div>
      )}
<div style={sectionTitle}>Chart</div>

<div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
  {TIMEFRAMES.map((t) => (
    <button
      key={t.label}
      type="button"
      onClick={() => setTf(t)}
      style={{
        padding: "6px 10px",
        borderRadius: "999px",
        border: t.label === tf.label ? "2px solid #111827" : "1px solid #E5E7EB",
        background: "#fff",
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {t.label}
    </button>
  ))}
</div>

<div style={{ ...card, padding: "10px", height: "auto" }}>
<div style={{ ...card, padding: "10px", height: "auto" }}>
  {chartLoading ? (
    <div style={{ fontSize: "14px", color: "#6b7280" }}>
      Loading chart…
    </div>
  ) : Array.isArray(candles) && candles.length > 0 ? (
    <StockChart candles={candles} />
  ) : (
    <div style={{ fontSize: "14px", color: "#6b7280" }}>
      No chart data available for this timeframe.
    </div>
  )}
</div>

</div>


    
      {/* Key data points */}
      <div style={sectionTitle}>Key data points</div>
      <div style={twoCol}>
        <div style={card}>
          <div style={label}>Volume</div>
          <div style={value}>{details?.volume ?? "—"}</div>
        </div>
        <div style={card}>
          <div style={label}>Previous close</div>
          <div style={value}>{details?.prev_close ?? "—"}</div>
        </div>
        <div style={card}>
          <div style={label}>Open</div>
          <div style={value}>{details?.open ?? "—"}</div>
        </div>
        <div style={card}>
          <div style={label}>Day's range</div>
          <div style={value}>
            {details?.day_low && details?.day_high
              ? `${details.day_low} — ${details.day_high}`
              : "—"}
          </div>
        </div>
      </div>

      {/* About */}
      <div style={sectionTitle}>About {selectedStock.company_name.trim()}</div>
      <div style={{ ...card, fontSize: "14px", lineHeight: 1.5 }}>
        {details?.about ??
          "Summary about this stock will appear here once you connect the detailed fundamentals API."}
      </div>

      {/* Technicals */}
      <div style={sectionTitle}>Technicals</div>
      <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
        Summarizing what the indicators are suggesting.
      </div>
      <div style={techRow}>
        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Oscillators</div>
          <div style={{ fontSize: "14px" }}>
            {details?.technicals?.oscillators ?? "Neutral"}
          </div>
        </div>
        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Summary</div>
          <div style={{ fontSize: "14px" }}>
            {details?.technicals?.summary ?? "Strong buy"}
          </div>
        </div>
        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Moving Averages
          </div>
          <div style={{ fontSize: "14px" }}>
            {details?.technicals?.moving_averages ?? "Strong buy"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== Other tabs (unchanged) ===================== */

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
        <div style={sectionTitle}>My Events</div>
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
              <div style={label}>Holdings (5)</div>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>
                $ 5,676,433
              </div>
            </div>
            <div style={{ fontSize: "36px" }}>📈</div>
          </div>
          <div style={{ marginTop: "12px" }}>
            <div style={label}>1D Returns</div>
            <div style={label}>Total Returns</div>
            <div style={label}>Invested</div>
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Total Value</div>
        <div
          style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}
        >
          $ 5,676,433
        </div>
        <div style={label}>Loss</div>
        <div style={label}>Profit</div>

        <div style={chartBox}>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: 8 }}>
            Change%
          </div>
          <div style={{ fontSize: "14px", opacity: 0.6 }}>
            Chart placeholder
          </div>
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
        <span>Suggestion 1</span>
        <span>➤</span>
      </div>
      <div style={card}>
        <span>Suggestion 2</span>
        <span>➤</span>
      </div>
      <div style={card}>
        <span>Suggestion 3</span>
        <span>➤</span>
      </div>
    </div>
  );
}

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
      <div style={{ fontSize: "14px", opacity: 0.7, marginTop: "8px" }}></div>
    </div>
  );
}

function renderWatchlistTab() {
  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Watchlist</h2>
      <p style={{ textAlign: "center" }}>
        Your watchlisted stocks will appear here.
      </p>
    </div>
  );
}

function renderFeaturesTab() {
  const itemStyle = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "10px",
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Features</h2>
      <div style={itemStyle}>IPO’s</div>
      <div style={itemStyle}>Intraday</div>
      <div style={itemStyle}>Events</div>
      <div style={itemStyle}>MTF</div>
      <div style={itemStyle}>ETF</div>
      <div style={itemStyle}>Gold Bonds</div>
    </div>
  );
}
