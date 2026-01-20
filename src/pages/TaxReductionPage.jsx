// src/pages/TaxReductionPage.jsx
import React, { useState } from "react";

const CURRENCY_META = {
  INR: { label: "₹", locale: "en-IN", currency: "INR", rate: 1 },
  USD: { label: "$", locale: "en-US", currency: "USD", rate: 0.012 },
  EUR: { label: "€", locale: "en-IE", currency: "EUR", rate: 0.011 },
};

export default function TaxReductionPage() {
  const [mode, setMode] = useState("calculator"); // "calculator" | "manual"

  // basic profile – calculator mode
  const [earningType, setEarningType] = useState("salary");
  const [ageBand, setAgeBand] = useState("under60");
  const [residentStatus, setResidentStatus] = useState("resident");

  const [income, setIncome] = useState("");
  const [regime, setRegime] = useState("new");
  const [professionalTax, setProfessionalTax] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [result, setResult] = useState(null);

  // ===== TAX LOGIC (CALCULATOR MODE, INR) =====
  const calculateOldRegimeTax = (taxableIncome) => {
    let tax = 0;

    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 250000 * 0.05 + (taxableIncome - 500000) * 0.2;
    } else {
      tax =
        250000 * 0.05 +
        500000 * 0.2 +
        (taxableIncome - 1000000) * 0.3;
    }
    return Math.max(tax, 0);
  };

  const calculateNewRegimeTax = (taxableIncome) => {
    let tax = 0;
    let remaining = taxableIncome;

    const slab = (limit, rate) => {
      if (remaining <= 0) return 0;
      const taxableAtThisRate = Math.min(remaining, limit);
      remaining -= taxableAtThisRate;
      return taxableAtThisRate * rate;
    };

    remaining -= Math.min(remaining, 300000); // 0–3L: 0%
    tax += slab(300000, 0.05); // 3–6L
    tax += slab(300000, 0.1); // 6–9L
    tax += slab(300000, 0.15); // 9–12L
    tax += slab(300000, 0.2); // 12–15L
    if (remaining > 0) tax += remaining * 0.3; // >15L

    return Math.max(tax, 0);
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    if (earningType === "none") {
      setResult({
        incomeINR: 0,
        rows: [],
        totalTaxINR: 0,
        effectiveRate: 0,
        meta: { earningType, ageBand, residentStatus, regime },
      });
      return;
    }

    const incomeINR = Number(income || 0);
    const profTaxINR = Number(professionalTax || 0);

    if (!incomeINR || incomeINR <= 0) {
      setResult(null);
      return;
    }

    const baseTax =
      regime === "old"
        ? calculateOldRegimeTax(incomeINR)
        : calculateNewRegimeTax(incomeINR);

    const cess = baseTax * 0.04;

    const rows = [];
    if (baseTax > 0) {
      rows.push({
        key: "income",
        name: `Income Tax (${regime === "new" ? "New" : "Old"} Regime)`,
        amountINR: baseTax,
      });
    }
    if (cess > 0) {
      rows.push({
        key: "cess",
        name: "Health & Education Cess (4%)",
        amountINR: cess,
      });
    }
    if (profTaxINR > 0) {
      rows.push({
        key: "pt",
        name: "Professional Tax (State)",
        amountINR: profTaxINR,
      });
    }

    const totalTaxINR = rows.reduce((sum, r) => sum + r.amountINR, 0);
    const effectiveRate = (totalTaxINR / incomeINR) * 100;

    setResult({
      incomeINR,
      rows,
      totalTaxINR,
      effectiveRate,
      meta: { earningType, ageBand, residentStatus, regime },
    });
  };

  const formatAmount = (amountINR) => {
    if (amountINR == null) return "-";
    const meta = CURRENCY_META[currency];
    const converted = amountINR * meta.rate;
    return converted.toLocaleString(meta.locale, {
      style: "currency",
      currency: meta.currency,
      maximumFractionDigits: currency === "INR" ? 0 : 2,
    });
  };

  const formatPct = (v) =>
    Number.isFinite(v) ? `${v.toFixed(2)}%` : "-";

  // Explain when to pay (calculator mode)
  const getWhenToPay = (meta) => {
    if (!meta) return null;

    if (meta.earningType === "none") {
      return {
        title: "Do I need to pay tax?",
        points: [
          "You said you are not earning right now, so you usually won’t have income tax to pay.",
          "If any bank / broker is already deducting TDS on interest or investments, that may be enough.",
          "You may still choose to file a tax return to claim refunds or keep records clean.",
        ],
      };
    }

    if (meta.earningType === "salary" || meta.earningType === "retired") {
      return {
        title: "When is tax usually paid for salaried / pension income?",
        points: [
          "Your employer / pension provider normally deducts TDS from your monthly payout.",
          "At year end you get Form 16 showing total salary and tax deducted.",
          "If this calculator’s estimate is higher than the TDS in Form 16, you pay the difference as self-assessment tax before filing your return (usually by 31 July for individuals without audit).",
        ],
      };
    }

    if (meta.earningType === "self") {
      return {
        title: "When is tax usually paid for self-employed / business income?",
        points: [
          "You pay ‘advance tax’ in 4 instalments during the year: 15 June, 15 Sept, 15 Dec and 15 March.",
          "By 15 March, at least 100% of your estimated tax for the year should be paid to avoid interest.",
          "After year end you file your tax return, adjust for the exact income, and pay / claim any difference.",
        ],
      };
    }

    return null;
  };

  const scheduleInfo = getWhenToPay(result?.meta);

  // ===== MANUAL MODE STATE =====
  const [manualIncome, setManualIncome] = useState(""); // ₹
  const [manualTaxes, setManualTaxes] = useState([]);   // {id, name, pct}
  const [manualName, setManualName] = useState("");

  const handleManualKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = manualName.trim();
      if (!trimmed) return;

      // don’t duplicate names
      if (
        manualTaxes.some(
          (t) => t.name.toLowerCase() === trimmed.toLowerCase()
        )
      ) {
        setManualName("");
        return;
      }

      setManualTaxes((prev) => [
        ...prev,
        { id: Date.now(), name: trimmed, pct: "" },
      ]);
      setManualName("");
    }
  };

  const handleManualPctChange = (id, value) => {
    setManualTaxes((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, pct: value } : t
      )
    );
  };

  const removeManualTax = (id) => {
    setManualTaxes((prev) => prev.filter((t) => t.id !== id));
  };

  const manualIncomeNumber = Number(manualIncome || 0);
  const manualRows = manualTaxes.map((t) => {
    const pctNum = parseFloat(t.pct) || 0;
    const amountINR = manualIncomeNumber * (pctNum / 100);
    return { ...t, pctNum, amountINR };
  });
  const totalManualTaxINR = manualRows.reduce(
    (sum, r) => sum + r.amountINR,
    0
  );
  const manualHasData =
    manualIncomeNumber > 0 && manualTaxes.length > 0;

  return (
    <section className="feature page-tax">
      <h1 className="feature-title">Tax Calculator</h1>
      <p className="feature-sub">
        Answer a few basic questions to see how much tax you pay and when.
      </p>

      {/* Mode toggle */}
      <div className="invest-tabs">
        <button
          type="button"
          className={`tab ${mode === "calculator" ? "active" : ""}`}
          onClick={() => setMode("calculator")}
        >
          Use Calculator
        </button>
        <span className="tab-sep">/</span>
        <button
          type="button"
          className={`tab ${mode === "manual" ? "active" : ""}`}
          onClick={() => setMode("manual")}
        >
          Enter Manually
        </button>
      </div>

      {/* Currency toggle */}
      <div className="currency-toggle">
        <span>Show amounts in:</span>
        {Object.entries(CURRENCY_META).map(([code, meta]) => (
          <button
            key={code}
            type="button"
            className={`currency-pill ${
              currency === code ? "on" : ""
            }`}
            onClick={() => setCurrency(code)}
          >
            {meta.label} {code}
          </button>
        ))}
        <p className="currency-note">
          Income is entered in ₹ (INR). Currency switch only changes how
          results are displayed.
        </p>
      </div>

      {/* ================= CALCULATOR MODE ================= */}
      {mode === "calculator" && (
        <>
          <form className="tax-form tax-q-list" onSubmit={handleCalculate}>
            {/* Q1 */}
            <div className="tax-field">
              <div className="tax-label">
                1. Are you currently earning money in India?
              </div>
              <div className="tax-options">
                <label>
                  <input
                    type="radio"
                    name="earningType"
                    value="none"
                    checked={earningType === "none"}
                    onChange={() => setEarningType("none")}
                  />
                  I’m not earning right now
                </label>
                <label>
                  <input
                    type="radio"
                    name="earningType"
                    value="salary"
                    checked={earningType === "salary"}
                    onChange={() => setEarningType("salary")}
                  />
                  I have a salary
                </label>
                <label>
                  <input
                    type="radio"
                    name="earningType"
                    value="self"
                    checked={earningType === "self"}
                    onChange={() => setEarningType("self")}
                  />
                  I run a business / freelance
                </label>
                <label>
                  <input
                    type="radio"
                    name="earningType"
                    value="retired"
                    checked={earningType === "retired"}
                    onChange={() => setEarningType("retired")}
                  />
                  I’m retired / mainly on pension
                </label>
              </div>
            </div>

            {/* Q2 */}
            <div className="tax-field">
              <div className="tax-label">2. What is your age?</div>
              <div className="tax-options">
                <label>
                  <input
                    type="radio"
                    name="ageBand"
                    value="under60"
                    checked={ageBand === "under60"}
                    onChange={() => setAgeBand("under60")}
                  />
                  &lt; 60 years
                </label>
                <label>
                  <input
                    type="radio"
                    name="ageBand"
                    value="60to79"
                    checked={ageBand === "60to79"}
                    onChange={() => setAgeBand("60to79")}
                  />
                  60–79 years
                </label>
                <label>
                  <input
                    type="radio"
                    name="ageBand"
                    value="80plus"
                    checked={ageBand === "80plus"}
                    onChange={() => setAgeBand("80plus")}
                  />
                  80+ years
                </label>
              </div>
            </div>

            {/* Q3 */}
            <div className="tax-field">
              <div className="tax-label">3. Residency status</div>
              <div className="tax-options">
                <label>
                  <input
                    type="radio"
                    name="resident"
                    value="resident"
                    checked={residentStatus === "resident"}
                    onChange={() => setResidentStatus("resident")}
                  />
                  Resident in India
                </label>
                <label>
                  <input
                    type="radio"
                    name="resident"
                    value="nri"
                    checked={residentStatus === "nri"}
                    onChange={() => setResidentStatus("nri")}
                  />
                  Non-resident (NRI)
                </label>
              </div>
            </div>

            {/* Q4 */}
            <div className="tax-field">
              <div className="tax-label">
                4. Annual taxable income (₹, after deductions)
              </div>
              <input
                className="tax-input"
                type="number"
                min="0"
                step="1000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g. 1200000"
                disabled={earningType === "none"}
                required={earningType !== "none"}
              />
              {earningType === "none" && (
                <p className="tax-help">
                  You selected “not earning right now”. You can leave this
                  empty if you’re only checking the explanation.
                </p>
              )}
            </div>

            {/* Q5 */}
            <div className="tax-field">
              <div className="tax-label">5. Preferred regime</div>
              <div className="tax-options">
                <label>
                  <input
                    type="radio"
                    name="regime"
                    value="new"
                    checked={regime === "new"}
                    onChange={() => setRegime("new")}
                  />
                  New Regime
                </label>
                <label>
                  <input
                    type="radio"
                    name="regime"
                    value="old"
                    checked={regime === "old"}
                    onChange={() => setRegime("old")}
                  />
                  Old Regime
                </label>
              </div>
              <p className="tax-help">
                If you’re not sure, leave it on New Regime. This is the
                default for most people now.
              </p>
            </div>

            {/* Q6 */}
            <div className="tax-field">
              <div className="tax-label">
                6. Professional tax paid in the year (₹, optional)
              </div>
              <input
                className="tax-input"
                type="number"
                min="0"
                step="100"
                value={professionalTax}
                onChange={(e) => setProfessionalTax(e.target.value)}
                placeholder="e.g. 2400"
                disabled={earningType === "none"}
              />
            </div>

            <div className="tax-actions">
              <button type="submit" className="btn cta">
                CALCULATE TAXES
              </button>
            </div>
          </form>

          {/* RESULTS */}
          {result && (
            <>
              {result.meta.earningType === "none" ? (
                <p className="tax-summary">
                  You selected that you’re not earning right now, so you
                  usually don’t have income tax to pay. If you start earning
                  or have interest / capital gains with TDS, you can come
                  back and run the calculator again.
                </p>
              ) : (
                <>
                  <p className="tax-summary">
                    For a taxable income of{" "}
                    <strong>{formatAmount(result.incomeINR)}</strong>, your
                    estimated total tax outgo is{" "}
                    <strong>{formatAmount(result.totalTaxINR)}</strong> (
                    {formatPct(result.effectiveRate)} of income).
                  </p>

                  <div className="tax-table-wrap">
                    <table className="tax-table">
                      <thead>
                        <tr>
                          <th>Tax</th>
                          <th>Percentage of Income</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row) => {
                          const pct =
                            (row.amountINR / result.incomeINR) * 100;
                          return (
                            <tr key={row.key}>
                              <td>{row.name}</td>
                              <td>{formatPct(pct)}</td>
                              <td>{formatAmount(row.amountINR)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2}>Total Tax Payable</td>
                          <td>{formatAmount(result.totalTaxINR)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}

              {scheduleInfo && (
                <div className="tax-when">
                  <h3>{scheduleInfo.title}</h3>
                  <ul>
                    {scheduleInfo.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  {residentStatus === "nri" && (
                    <p className="tax-note">
                      You marked yourself as Non-resident. NRI tax rules
                      and deadlines can differ – this is only a rough guide.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ================= MANUAL MODE ================= */}
      {mode === "manual" && (
        <div className="tax-manual">
          {/* income on top */}
          <div className="tax-field">
            <div className="tax-label">
              Annual taxable income (₹, after deductions)
            </div>
            <input
              className="tax-input"
              type="number"
              min="0"
              step="1000"
              value={manualIncome}
              onChange={(e) => setManualIncome(e.target.value)}
              placeholder="e.g. 1200000"
            />
            <p className="tax-help">
              We’ll use this income and the percentages you enter below to
              calculate how much tax you pay under each head.
            </p>
          </div>

          {/* add tax names */}
          <div className="tax-tags">
            <div className="tax-tags-row">
              <input
                className="tax-type-input"
                placeholder="Type a tax you pay (e.g. Property tax, GST on side business, Surcharge)… Press Enter to add."
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                onKeyDown={handleManualKeyDown}
              />
            </div>
            <p className="tax-help">
              Each tax you add will appear in the table. Then type what %
              of your annual income it takes.
            </p>

            {/* table of manual taxes */}
            {manualTaxes.length > 0 && (
              <div className="tax-table-wrap">
                <table className="tax-table">
                  <thead>
                    <tr>
                      <th>Tax name</th>
                      <th>% of income</th>
                      <th>Amount</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {manualRows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.name}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={row.pct}
                            onChange={(e) =>
                              handleManualPctChange(
                                row.id,
                                e.target.value
                              )
                            }
                            style={{
                              width: "90px",
                              border: "0",
                              borderBottom: "2px solid #111",
                              background: "transparent",
                              outline: "none",
                            }}
                          />{" "}
                          %
                        </td>
                        <td>{manualIncomeNumber > 0 ? formatAmount(row.amountINR) : "-"}</td>
                        <td>
                          <button
                            type="button"
                            className="tag-x"
                            onClick={() => removeManualTax(row.id)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {manualHasData && (
                    <tfoot>
                      <tr>
                        <td colSpan={2}>Total of manual taxes</td>
                        <td>{formatAmount(totalManualTaxINR)}</td>
                        <td />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {manualHasData && (
              <p className="tax-summary">
                Based on an income of{" "}
                <strong>{formatAmount(manualIncomeNumber)}</strong> and
                the percentages you entered, your manual taxes add up to{" "}
                <strong>{formatAmount(totalManualTaxINR)}</strong>{" "}
                ({formatPct((totalManualTaxINR / manualIncomeNumber) * 100)}{" "}
                of your income).
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
