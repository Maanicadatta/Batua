// src/pages/BudgetingPage.jsx
import React, { useState, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Same data you were using on YourBatua
const chartData = [
  { name: "Saving", value: 40, color: "#00C8C8" },
  { name: "Investing", value: 28, color: "#00A0E8" },
  { name: "Spending", value: 16, color: "#D2E4F3" },
  { name: "Taxes", value: 8, color: "#828282" },
  { name: "FD", value: 8, color: "#29C5A3" },
];
// === Single-bucket editor pieces (from old page) ===

const RupeeSelect = ({ disabled }) => (
  <select className="cur" disabled={disabled}>
    <option>₹</option>
    <option>$</option>
    <option>€</option>
  </select>
);

const LineField = ({ label, disabled }) => (
  <div className="line-field">
    <span className="line-label">{label}:</span>
    <div className="line-input">
      <RupeeSelect disabled={disabled} />
      <input
        type="number"
        inputMode="decimal"
        placeholder="0"
        disabled={disabled}
      />
    </div>
  </div>
);

function BucketCard({ title, initialTags, placeholder }) {
  const [editMode, setEditMode] = React.useState(true);
  const [tags, setTags] = React.useState(initialTags);
  const [draft, setDraft] = React.useState("");
  const [toRemove, setToRemove] = React.useState(new Set());
  const noteRef = React.useRef(null);

  const tokensFrom = (text) =>
    text
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const autoGrow = () => {
    const el = noteRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(el.scrollHeight, 140) + "px";
  };

  const addDraftNow = () => {
    if (!draft.trim()) return;
    const add = tokensFrom(draft);
    if (add.length) {
      setTags((prev) => Array.from(new Set([...prev, ...add])));
      setDraft("");
      autoGrow();
    }
  };

  const toggleRemove = (label) => {
    if (!editMode) return;
    setToRemove((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const commitChanges = () => {
    if (draft.trim()) addDraftNow();
    setTags((prev) => prev.filter((t) => !toRemove.has(t)));
    setToRemove(new Set());
    setEditMode(false);
  };

  const displayFields = tags.filter((t) => !toRemove.has(t));

  return (
    <div className={`bucket-card ${editMode ? "edit-mode" : "view-mode"}`}>
      <div className="bucket-card-hd">
        <h3>{title}</h3>

        <button
          className="edit"
          aria-label={editMode ? "Done editing" : "Edit"}
          onClick={() => (editMode ? commitChanges() : setEditMode(true))}
          type="button"
        >
          {editMode ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 20l4.5-1 9-9-3.5-3.5-9 9L4 20z"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5 6.5l3 3"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {displayFields.map((f) => (
        <LineField key={f} label={f} disabled={!editMode} />
      ))}

      <div className="note" style={{ overflow: "visible" }}>
        <div className="chips">
          {tags.map((t) => {
            const pending = toRemove.has(t);
            return (
              <span
                className={`chip ${pending ? "pending-remove" : ""}`}
                key={t}
              >
                {t}
                {editMode && (
                  <button
                    className="chip-x"
                    onClick={() => toggleRemove(t)}
                    aria-label={`Remove ${t}`}
                    type="button"
                  >
                    ×
                  </button>
                )}
              </span>
            );
          })}
        </div>

        <textarea
          ref={noteRef}
          className="note-ta"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            autoGrow();
          }}
          onKeyDown={(e) => {
            if (editMode && e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addDraftNow();
            }
          }}
          disabled={!editMode}
          rows={6}
        />
      </div>

      {editMode && (
        <div className="card-actions">
          <button className="btn-done" onClick={commitChanges} type="button">
            Done
          </button>
        </div>
      )}
    </div>
  );
}

// Re-usable bucket card
function BudgetBucketCard({
  title,
  amountLabel,
  subtitle,
  ctaLabel,
  onEdit,
  onAdd,
  onHistory,
}) {
  const cardStyle = {
    backgroundColor: "#d2e4ff",
    borderRadius: "24px",
    padding: "24px 32px 20px",
    minHeight: "260px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  };

  const editButtonStyle = {
    position: "absolute",
    top: "18px",
    right: "22px",
    cursor: "pointer",
    fontSize: "18px",
  };

  const donutOuter = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#2f7ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "12px auto 10px",
  };

  const donutInner = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    textAlign: "center",
  };

  const primaryButton = {
    margin: "10px auto 14px",
    padding: "10px 28px",
    borderRadius: "24px",
    border: "none",
    backgroundColor: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  };

  const slimButton = {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "20px",
    border: "none",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "14px",
    marginTop: "6px",
    cursor: "pointer",
  };

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: "22px", fontWeight: "700" }}>{title}</div>

      <div style={editButtonStyle} onClick={onEdit} title="Edit">
        ✏️
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "16px",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {amountLabel}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "#555",
          textAlign: "center",
          marginBottom: "4px",
        }}
      >
        {subtitle}
      </div>

      {/* fake donut */}
      <div style={donutOuter}>
        <div style={donutInner}>
          Great
          <br />
          Control!
        </div>
      </div>

      <div
        style={{
          fontSize: "13px",
          textAlign: "center",
          marginBottom: "2px",
        }}
      >
        You have ₹7,251 left to spend
      </div>

      <button style={primaryButton} onClick={onAdd}>
        {ctaLabel}
      </button>

      <button style={slimButton} onClick={onHistory}>
        <span>See {title} History</span>
        <span>➤</span>
      </button>
      <button style={slimButton} onClick={() => alert("Trends placeholder")}>
        <span>See {title} Trends</span>
        <span>➤</span>
      </button>
    </div>
  );
}

export default function BudgetingPage() {
  // Which bucket is in focus (Spending, Stocks, etc.)
  const [activeBucket, setActiveBucket] = useState(null);
  // "dashboard" | "edit" | "history"
  const [view, setView] = useState("dashboard");

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

  const pageStyle = {
    maxWidth: "1200px",
    margin: "80px auto 40px",
    padding: "0 24px 40px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "24px",
    marginTop: "24px",
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px",textAlign: "center" }}>
        Budgeting
      </h1>

      {/* ========= DASHBOARD VIEW ========= */}
      {view === "dashboard" && (
        <>
          {/* Assets breakdown (pie + balance card moved from YourBatua) */}
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginTop: "24px",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Assets Breakdown
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              marginBottom: "32px",
              flexWrap: "wrap",
            }}
          >
            {/* Pie chart */}
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

            {/* Balance summary card */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #ddd",
                padding: "16px 20px",
                minWidth: "260px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "8px",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Total Balance: ₹1,00,000
              </h3>
              <p style={{ margin: "4px 0" }}>Usable Balance: ₹80,000</p>
              <p style={{ margin: "4px 0" }}>Money Under Settlement: ₹5,000</p>
              <p style={{ margin: "4px 0" }}>Blocked Funds: ₹5,000</p>
              <p style={{ margin: "4px 0", fontWeight: 600 }}>
                Withdrawable Balance: ₹90,000
              </p>
              <button
                style={{
                  marginTop: "10px",
                  width: "100%",
                  borderRadius: "20px",
                  border: "none",
                  backgroundColor: "#d2e4ff",
                  padding: "8px 12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                See Money History
              </button>
            </div>
          </div>

          {/* Recommended Budget Buckets – moved from YourBatua */}
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Recommended Budget Buckets
          </h2>

          <div style={gridStyle}>
            <BudgetBucketCard
              title="Spending"
              amountLabel="₹7,49 / ₹8,000"
              subtitle="You’re 80% of your monthly limit"
              ctaLabel="Add a Spending +"
              onEdit={() => openEdit("Spending")}
              onAdd={() => openEdit("Spending")}
              onHistory={() => openHistory("Spending")}
            />
            <BudgetBucketCard
              title="Stocks"
              amountLabel="₹45,000"
              subtitle="Value of stock investments"
              ctaLabel="Add a Stock Investment"
              onEdit={() => openEdit("Stocks")}
              onAdd={() => openEdit("Stocks")}
              onHistory={() => openHistory("Stocks")}
            />
            <BudgetBucketCard
              title="Mutual Funds"
              amountLabel="₹60,000"
              subtitle="Total mutual fund holdings"
              ctaLabel="Add a MF Investment"
              onEdit={() => openEdit("Mutual Funds")}
              onAdd={() => openEdit("Mutual Funds")}
              onHistory={() => openHistory("Mutual Funds")}
            />
            <BudgetBucketCard
              title="Investments"
              amountLabel="₹1,05,000"
              subtitle="Combined long-term investments"
              ctaLabel="Add an Investment"
              onEdit={() => openEdit("Investments")}
              onAdd={() => openEdit("Investments")}
              onHistory={() => openHistory("Investments")}
            />
            <BudgetBucketCard
              title="Savings"
              amountLabel="₹25,000"
              subtitle="Safe money parked for goals"
              ctaLabel="Add a Saving"
              onEdit={() => openEdit("Savings")}
              onAdd={() => openEdit("Savings")}
              onHistory={() => openHistory("Savings")}
            />
            <BudgetBucketCard
              title="Taxes"
              amountLabel="₹8,000"
              subtitle="Money kept aside for upcoming taxes"
              ctaLabel="Add a Tax Payment"
              onEdit={() => openEdit("Taxes")}
              onAdd={() => openEdit("Taxes")}
              onHistory={() => openHistory("Taxes")}
            />
          </div>

          {/* Bottom buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <button
              style={{
                padding: "10px 22px",
                borderRadius: "22px",
                border: "none",
                backgroundColor: "#00c8c8",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add Another Budget Bucket
            </button>
            <button
              style={{
                padding: "10px 22px",
                borderRadius: "22px",
                border: "none",
                backgroundColor: "#d2e4ff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              See All Trends
            </button>
          </div>
        </>
      )}

    {view === "edit" && activeBucket && (
  <div style={{ marginTop: "32px" }}>
    <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px" }}>
      {activeBucket} – Monthly Buckets
    </h2>

    <div style={{ maxWidth: "900px" }}>
      <BucketCard
        title={activeBucket}
        // You can customise these per bucket if you like:
        initialTags={
          activeBucket === "Spending"
            ? ["Rent", "Skincare"]
            : activeBucket === "Taxes"
            ? ["GST", "Income Tax"]
            : activeBucket === "Savings"
            ? ["FD", "Emergency Fund"]
            : ["Item 1", "Item 2"]
        }
        placeholder={`Type other predicted ${activeBucket.toLowerCase()} for the month…`}
      />
    </div>

    <button
      onClick={backToDashboard}
      style={{
        marginTop: "20px",
        padding: "10px 18px",
        borderRadius: "20px",
        border: "none",
        backgroundColor: "#d2e4ff",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Back
    </button>
  </div>
)}


      {/* ========= HISTORY VIEW ========= */}
      {view === "history" && (
        <div style={{ marginTop: "32px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700" }}>
            {activeBucket} – History
          </h2>

          {/* Simple placeholder list – later hook to real data */}
          <ul style={{ marginTop: "12px", lineHeight: "1.6" }}>
            <li>1 Jan – ₹1,000 – Grocery</li>
            <li>5 Jan – ₹500 – Coffee</li>
            <li>9 Jan – ₹2,000 – Rent</li>
          </ul>

          <button
            onClick={backToDashboard}
            style={{
              marginTop: "20px",
              padding: "10px 18px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: "#d2e4ff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}


