// src/pages/BudgetingPage.jsx
import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// ===== existing chart data =====
const chartData = [
  { name: "Saving", value: 40, color: "#00C8C8" },
  { name: "Investing", value: 28, color: "#00A0E8" },
  { name: "Spending", value: 16, color: "#D2E4F3" },
  { name: "Taxes", value: 8, color: "#828282" },
  { name: "FD", value: 8, color: "#29C5A3" },
];

// ===== small helpers =====
const formatINR = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const clamp0 = (n) => Math.max(0, Number(n || 0));
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

// ===== Mode toggle =====
// ===== Mode toggle =====
function BudgetModeToggle({ mode, setMode, view }) {
  if (view !== "dashboard") return null;

  return (
    <div className="budget-mode">
      <button
        type="button"
        className={`budget-mode-btn ${mode === "batua" ? "on" : ""}`}
        onClick={() => setMode("batua")}
      >
        Let Batua plan my budget
      </button>

      <button
        type="button"
        className={`budget-mode-btn ${mode === "manual" ? "on" : ""}`}
        onClick={() => setMode("manual")}
      >
        I&apos;ll set it myself
      </button>
    </div>
  );
}



  

// ===== Income -> Allocation strip =====
function AllocationStrip({ income, setIncome, allocations, setAllocations, mode }) {
  const total = useMemo(
    () => Object.values(allocations).reduce((a, b) => a + clamp0(b), 0),
    [allocations]
  );

  const items = [
    { key: "taxes", label: "Taxes" },
    { key: "savings", label: "Savings" },
    { key: "spending", label: "Spending" },
    { key: "investing", label: "Investing" },
  ];

  return (
    <div className="alloc-strip">
      <div className="alloc-strip-top">
        <div className="alloc-income">
          <div className="alloc-kicker">Monthly Income</div>
          <div className="alloc-amt">{formatINR(income)}</div>
        </div>

        <div className="alloc-meta">
          <div className="alloc-kicker">Budget Mode</div>
          <div className="alloc-mode">{mode === "batua" ? "Batua Suggested" : "Manual"}</div>
        </div>

        <div className="alloc-meta">
          <div className="alloc-kicker">Allocated</div>
          <div className="alloc-mode">
            {formatINR(total)} <span className="alloc-muted">/ {formatINR(income)}</span>
          </div>
        </div>
      </div>

      {mode === "manual" && setIncome && setAllocations ? (
        <ManualBudgetSetupCard
          income={income}
          setIncome={setIncome}
          allocations={allocations}
          setAllocations={setAllocations}
        />
      ) : (
        <div className="your-existing-suggested-card">...</div>
      )}

      <div className="alloc-rows">
        {items.map((it) => {
          const v = clamp0(allocations[it.key]);
          const pct = income > 0 ? Math.round((v / income) * 100) : 0;
          return (
            <div className="alloc-row" key={it.key}>
              <div className="alloc-row-left">
                <div className="alloc-row-label">{it.label}</div>
                <div className="alloc-row-sub">
                  {formatINR(v)} <span className="alloc-muted">• {pct}%</span>
                </div>
              </div>
              <div className="alloc-bar">
                <div
                  className="alloc-bar-fill"
                  style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="alloc-foot">
        <span className="alloc-foot-dot" />
        These are sample values right now — wire to your real salary + rules later.
      </div>
    </div>
  );
}

// ===== Insights badge =====
function InsightBadge({ tone = "neutral", children }) {
  return <span className={`insight-badge ${tone}`}>{children}</span>;
}

// ===== Bucket tile (CLICKABLE) =====
// - No edit icon
// - No add/update CTA button
// - Clicking the tile opens editor
function BucketTile({ title, amount, subtitle, insight, primary = false, onOpen, onHistory, onWhy }) {
  const [moreOpen, setMoreOpen] = useState(false);

  const openTile = () => onOpen?.();
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openTile();
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className={`bucket-tile clickable ${primary ? "primary" : ""}`}
      role="button"
      tabIndex={0}
      onClick={openTile}
      onKeyDown={onKeyDown}
      aria-label={`Edit ${title}`}
    >
      <div className="bucket-tile-top">
        <div>
          <div className="bucket-title">{title}</div>
          <div className="bucket-sub">{subtitle}</div>
        </div>

        <div className="bucket-actions" onClick={stop} onKeyDown={stop}>
          <div className="bucket-more">
            <button
              type="button"
              className="bucket-more-btn"
              onClick={() => setMoreOpen((v) => !v)}
            >
              More ▾
            </button>

            {moreOpen && (
              <div className="bucket-more-menu">
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onHistory?.();
                  }}
                >
                  See History
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    alert("Trends placeholder");
                  }}
                >
                  See Trends
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onWhy?.();
                  }}
                >
                  Why this amount?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bucket-amount">{amount}</div>

      <div className="bucket-insight-row">
        <InsightBadge tone={insight?.tone}>{insight?.text}</InsightBadge>

        <button type="button" className="bucket-why-link" onClick={(e) => { e.stopPropagation(); onWhy?.(); }}>
          Why?
        </button>
      </div>
    </div>
  );
}

// ===== old editor pieces (kept) =====
const RupeeSelect = ({ disabled }) => (
  <select
    disabled={disabled}
    style={{
      height: 40,
      borderRadius: 12,
      border: "1px solid #DCE6F2",
      background: "#FFFFFF",
      padding: "0 10px",
      fontWeight: 700,
    }}
  >
    <option>₹</option>
    <option>$</option>
    <option>€</option>
  </select>
);

const LineField = ({ label, disabled }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 220px",
      gap: 12,
      alignItems: "center",
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid #EEF2F8",
      background: "#FBFCFF",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontWeight: 800, fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 12, color: "#6B7788" }}>Monthly amount</div>
    </div>

    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
      <RupeeSelect disabled={disabled} />
      <input
        type="number"
        inputMode="decimal"
        placeholder="0"
        disabled={disabled}
        style={{
          height: 40,
          width: 140,
          borderRadius: 12,
          border: "1px solid #DCE6F2",
          padding: "0 12px",
          fontWeight: 800,
          outline: "none",
        }}
      />
    </div>
  </div>
);


// ===== BucketCard (ALWAYS EDITABLE, no edit icon, no Done button) =====
function BucketCard({ title, initialTags, placeholder }) {
  const [tags, setTags] = React.useState(initialTags);
  const [draft, setDraft] = React.useState("");
  const [newItem, setNewItem] = React.useState("");

  const tokensFrom = (text) =>
    text
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const addNewItem = () => {
    const v = newItem.trim();
    if (!v) return;
    setTags((prev) => Array.from(new Set([...prev, v])));
    setNewItem("");
  };

  const addDraftNow = () => {
    if (!draft.trim()) return;
    const add = tokensFrom(draft);
    if (add.length) {
      setTags((prev) => Array.from(new Set([...prev, ...add])));
      setDraft("");
    }
  };

  const removeTag = (label) => {
    setTags((prev) => prev.filter((t) => t !== label));
  };

  return (
    <div>
      {/* Title row */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{title}</div>
          <div style={{ fontSize: 13, color: "#5B6777" }}>
            Break this bucket into sub-categories for cleaner tracking.
          </div>
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid #E6EDF7",
            background: "#FBFCFF",
            fontSize: 13,
            fontWeight: 800,
            color: "#3D4A5C",
            height: "fit-content",
          }}
        >
          Monthly
        </div>
      </div>

      {/* Add item row */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          padding: 12,
          borderRadius: 14,
          border: "1px solid #E9EEF5",
          background: "#FBFCFF",
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 14, minWidth: 120 }}>Add category</div>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="e.g., Utilities, Insurance, Fuel"
          style={{
            flex: 1,
            height: 40,
            borderRadius: 12,
            border: "1px solid #DCE6F2",
            padding: "0 12px",
            outline: "none",
            fontWeight: 700,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addNewItem();
            }
          }}
        />
        <button
          type="button"
          onClick={addNewItem}
          style={{
            height: 40,
            padding: "0 14px",
            borderRadius: 12,
            border: "1px solid #DCE6F2",
            background: "white",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tags.map((f) => (
          <div key={f} style={{ position: "relative" }}>
            <LineField label={f} disabled={false} />
            <button
              type="button"
              onClick={() => removeTag(f)}
              aria-label={`Remove ${f}`}
              style={{
                position: "absolute",
                right: 10,
                top: 10,
                height: 30,
                width: 30,
                borderRadius: 10,
                border: "1px solid #E2EAF5",
                background: "white",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 8 }}>Notes</div>
        <textarea
          className="note-ta"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addDraftNow();
            }
          }}
          rows={4}
          style={{
            width: "100%",
            borderRadius: 14,
            border: "1px solid #DCE6F2",
            padding: 12,
            outline: "none",
            fontWeight: 600,
            resize: "vertical",
          }}
        />

        <div style={{ marginTop: 8, fontSize: 12, color: "#6B7788" }}>
          Tip: Press Enter to quickly turn a line into a category (or use it just as notes).
        </div>
      </div>
    </div>
  );
}

function ManualBudgetSetupCard({ income, setIncome, allocations, setAllocations }) {
  const rows = [
    { key: "taxes", label: "Taxes" },
    { key: "savings", label: "Savings" },
    { key: "spending", label: "Spending" },
    { key: "investing", label: "Investing" },
  ];

  const totalAllocated = rows.reduce((sum, r) => sum + (Number(allocations[r.key]) || 0), 0) || 0;
  const remaining = (Number(income) || 0) - totalAllocated;

  const setRow = (key, value) => {
    setAllocations((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="budget-setup-card">
      <div className="setup-top">
        <div>
          <div className="setup-kicker">MONTHLY INCOME</div>
          <div className="setup-income">
            <span className="setup-cur">₹</span>
            <input
              className="setup-income-input"
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>
        </div>

        <div className="setup-metrics">
          <div className="metric">
            <div className="metric-label">ALLOCATED</div>
            <div className="metric-val">₹{totalAllocated.toLocaleString("en-IN")}</div>
          </div>
          <div className="metric">
            <div className="metric-label">REMAINING</div>
            <div className={`metric-val ${remaining < 0 ? "bad" : ""}`}>
              ₹{remaining.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      <div className="setup-rows">
        {rows.map((r) => (
          <div className="setup-row" key={r.key}>
            <div className="setup-row-left">
              <div className="setup-row-title">{r.label}</div>
              <div className="setup-row-sub">Set your monthly allocation</div>
            </div>
            <div className="setup-row-right">
              <span className="setup-cur small">₹</span>
              <input
                className="setup-row-input"
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={allocations[r.key]}
                onChange={(e) => setRow(r.key, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="setup-footnote">
        Tip: you can keep “Remaining” as buffer, or allocate it into Savings/Spending.
      </div>
    </div>
  );
}
function SubviewHeader({ title, subtitle, onBack, right }) {
  return (
    <div
      className="subview-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "white",
        padding: "14px 18px",
        borderRadius: 14,
        border: "1px solid #E9EEF5",
        boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 16, fontWeight: 800 }}>{title}</div>
        {subtitle ? (
          <div style={{ fontSize: 13, color: "#5B6777" }}>{subtitle}</div>
        ) : null}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {right}
        <button
          type="button"
          className="soft-btn"
          onClick={onBack}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #DCE6F2",
            background: "#F6F9FE",
            fontWeight: 700,
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

// ===== page =====
export default function BudgetingPage() {
  const [mode, setMode] = useState("batua");

  const [activeBucket, setActiveBucket] = useState(null);
  const [view, setView] = useState("dashboard");

  const [manualIncome, setManualIncome] = useState("");
  const [manualAllocations, setManualAllocations] = useState({
    taxes: "",
    savings: "",
    spending: "",
    investing: "",
  });

  const batuaIncome = 120000;
  const batuaAllocations = {
    taxes: 18000,
    savings: 24000,
    spending: 48000,
    investing: 30000,
  };

  const income = mode === "manual" ? manualIncome : batuaIncome;
  const allocations = mode === "manual" ? manualAllocations : batuaAllocations;

  const setIncome = mode === "manual" ? setManualIncome : undefined;
  const setAllocations = mode === "manual" ? setManualAllocations : undefined;

  const openEdit = (bucket) => {
    setActiveBucket(bucket);
    setView("edit");
  };

  const openHistory = (bucket) => {
    setActiveBucket(bucket);
    setView("history");
  };

  const backToDashboard = () => {
    setActiveBucket(null);
    setView("dashboard");
  };

  const whyThisAmount = (bucket) => {
    alert(
      `${bucket}: placeholder explanation.\n\nLater: show a bottom-sheet explaining salary, goals, and rules used by Batua.`
    );
  };

  const tiles = [
    {
      title: "Spending",
      amount: "₹7,49 / ₹8,000",
      subtitle: "Monthly limit usage",
      insight: { tone: "good", text: "On track • 12 days left" },
      primary: true,
    },
    {
      title: "Taxes",
      amount: "₹8,000",
      subtitle: "Set aside for upcoming taxes",
      insight: { tone: "warn", text: "May rise next month" },
    },
    {
      title: "Savings",
      amount: "₹25,000",
      subtitle: "Safe money parked for goals",
      insight: { tone: "neutral", text: "Goal: Emergency fund first" },
    },
    {
      title: "Stocks",
      amount: "₹45,000",
      subtitle: "Value of stock investments",
      insight: { tone: "neutral", text: "Volatility detected" },
    },
    {
      title: "Mutual Funds",
      amount: "₹60,000",
      subtitle: "Total mutual fund holdings",
      insight: { tone: "good", text: "Stable • SIP consistent" },
    },
    {
      title: "Investments",
      amount: "₹1,05,000",
      subtitle: "Combined long-term investments",
      insight: { tone: "neutral", text: "Consider diversification" },
    },
  ];

  return (
    <div className="budget-page">
      <div className="budget-head">
        <h1 className="budget-title">Budgeting</h1>
        <p className="budget-subtitle">Track income, allocations, and bucket health — manually or with Batua.</p>
<BudgetModeToggle mode={mode} setMode={setMode} view={view} />
      </div>

      {/* ========= DASHBOARD VIEW ========= */}
      {view === "dashboard" && (
        <>
          <div className="budget-top">
            <div className="budget-top-card">
              <div className="budget-top-hd">
                <div>
                  <div className="kicker">Assets Breakdown</div>
                  <div className="headline">Your current mix</div>
                </div>
              </div>

              <div className="budget-top-body">
                <div className="budget-pie">
                  <PieChart width={260} height={260}>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>

                <div className="budget-balance">
                  <div className="balance-title">Total Balance</div>
                  <div className="balance-amt">{formatINR(100000)}</div>

                  <div className="balance-grid">
                    <div className="balance-row">
                      <span>Usable</span>
                      <span>{formatINR(80000)}</span>
                    </div>
                    <div className="balance-row">
                      <span>Under Settlement</span>
                      <span>{formatINR(5000)}</span>
                    </div>
                    <div className="balance-row">
                      <span>Blocked</span>
                      <span>{formatINR(5000)}</span>
                    </div>
                    <div className="balance-row strong">
                      <span>Withdrawable</span>
                      <span>{formatINR(90000)}</span>
                    </div>
                  </div>

                  <button type="button" className="soft-btn">
                    See Money History
                  </button>
                </div>
              </div>
            </div>

            <AllocationStrip
              income={income}
              setIncome={setIncome}
              allocations={allocations}
              setAllocations={setAllocations}
              mode={mode}
            />
          </div>

          {/* Buckets grid */}
          <div className="budget-section">
            <div className="section-hd">
              <div>
                <div className="kicker">Buckets</div>
                <div className="headline">Recommended budget buckets</div>
              </div>

              {/* removed add/update buttons */}
              <div className="section-actions" />
            </div>

            <div className="bucket-tiles">
              {tiles.map((t) => (
                <BucketTile
                  key={t.title}
                  title={t.title}
                  amount={t.amount}
                  subtitle={t.subtitle}
                  insight={t.insight}
                  primary={t.primary}
                  onOpen={() => openEdit(t.title)}
                  onHistory={() => openHistory(t.title)}
                  onWhy={() => whyThisAmount(t.title)}
                />
              ))}
            </div>
          </div>

          {/* Projection */}
          <div className="projection">
            <div className="projection-hd">
              <div className="kicker">Projection</div>
              <div className="headline">If you keep this budget for 12 months</div>
            </div>

            <div className="projection-grid">
              <div className="projection-card">
                <div className="projection-label">Savings</div>
                <div className="projection-value">{formatINR(300000)}</div>
              </div>
              <div className="projection-card">
                <div className="projection-label">Investments</div>
                <div className="projection-value">{formatINR(650000)}</div>
              </div>
              <div className="projection-card">
                <div className="projection-label">Taxes paid</div>
                <div className="projection-value">{formatINR(210000)}</div>
              </div>
            </div>

            <div className="projection-foot">
              (placeholder numbers — later calculate using actual income, rules, and growth assumptions)
            </div>
          </div>
        </>
      )}

      {/* ========= EDIT VIEW ========= */}
    {view === "edit" && activeBucket && (
  <div className="budget-subview" style={{ maxWidth: 980, margin: "0 auto" }}>
    <SubviewHeader
      title={`${activeBucket} — Monthly plan`}
      subtitle="Set sub-categories and amounts. Add any extra predicted items for this month."
      onBack={backToDashboard}
      right={
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid #E6EDF7",
            background: "#FBFCFF",
            fontSize: 13,
            fontWeight: 700,
            color: "#3D4A5C",
          }}
        >
          Auto-saved
        </div>
      }
    />

    <div style={{ height: 12 }} />

    <div
      style={{
        border: "1px solid #E9EEF5",
        borderRadius: 16,
        background: "white",
        padding: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      }}
    >
      <BucketCard
        title={activeBucket}
        initialTags={
          activeBucket === "Spending"
            ? ["Rent", "Groceries", "Transport"]
            : activeBucket === "Taxes"
            ? ["Income Tax", "GST"]
            : activeBucket === "Savings"
            ? ["Emergency Fund", "FD"]
            : ["Item 1", "Item 2"]
        }
        placeholder="Add notes for this bucket (optional)…"
      />
    </div>
  </div>
)}


      {/* ========= HISTORY VIEW ========= */}
     {view === "history" && (
  <div className="budget-subview" style={{ maxWidth: 980, margin: "0 auto" }}>
    <SubviewHeader
      title={`${activeBucket} — History`}
      subtitle="Recent activity in this bucket."
      onBack={backToDashboard}
    />

    <div style={{ height: 12 }} />

    <div
      style={{
        border: "1px solid #E9EEF5",
        borderRadius: 16,
        background: "white",
        padding: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      }}
    >
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 2 }}>
        <li>1 Jan — {formatINR(1000)} — Grocery</li>
        <li>5 Jan — {formatINR(500)} — Coffee</li>
        <li>9 Jan — {formatINR(2000)} — Rent</li>
      </ul>
    </div>
  </div>
)}

    </div>
  );
}
