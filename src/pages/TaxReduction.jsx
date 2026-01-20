// src/pages/TaxReduction.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function TaxReduction() {
  const bars = [
    { id: "old", label: "Old Regime", value: 7.2, color: "#74E6E7" },
    { id: "new", label: "New Regime", value: 5.8, color: "#28AFC0" },
  ];

  // --- sizing (classic layout) ---
  const W = 860,
    H = 520;
  const M = { top: 88, right: 32, bottom: 56, left: 84 };
  const innerW = W - M.left - M.right;
  const innerH = H - M.top - M.bottom;

  const BAR_W = 200;
  const BAR_GAP = 76;
  const MAX = 8;

  const totalBarsWidth = bars.length * BAR_W + (bars.length - 1) * BAR_GAP;
  const startX = M.left + (innerW - totalBarsWidth) / 2;

  const y = (v) => M.top + innerH - (v / MAX) * innerH;

  return (
    <section className="feature feature-tax">
      <div className="tax-grid">
        {/* LEFT: chart */}
        <div className="tax-chart" aria-hidden="true">
          <svg viewBox={`0 0 ${W} ${H}`} className="tax-svg">
            {/* legend */}
            <g
              className="tax-legend"
              transform={`translate(${W / 2 - 200}, ${M.top - 46})`}
            >
              <circle cx="0" cy="0" r="12" fill="#74E6E7" />
              <text x="20" y="6">
                Old Regime
              </text>
              <circle cx="200" cy="0" r="12" fill="#28AFC0" />
              <text x="220" y="6">
                New Regime
              </text>
            </g>

            {/* grid + y ticks (0..8) */}
            {[0, 2, 4, 6, 8].map((t) => (
              <g key={t}>
                <line
                  x1={M.left}
                  x2={W - M.right}
                  y1={y(t)}
                  y2={y(t)}
                  stroke="#e5e7eb"
                />
                <text
                  className="bar-y"
                  x={M.left - 16}
                  y={y(t) + 6}
                  textAnchor="end"
                >
                  {t}
                </text>
              </g>
            ))}

            {/* bars */}
            {bars.map((d, i) => {
              const x = startX + i * (BAR_W + BAR_GAP);
              const top = y(d.value);
              const h = M.top + innerH - top;

              return (
                <g key={d.id}>
                  <rect
                    x={x}
                    y={top}
                    width={BAR_W}
                    height={h}
                    rx="28"
                    fill={d.color}
                  />
                  {/* value on top */}
                  <text
                    className="bar-val"
                    x={x + BAR_W / 2}
                    y={top - 14}
                    textAnchor="middle"
                  >
                    {d.value} L
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* RIGHT: copy */}
        <div className="tax-copy">
          <h2 className="feature-title">TAX REDUCTION</h2>
          <p className="feature-sub">Pay what’s due, not a Rupee more</p>

          <ul className="checks ticks">
            <li>Exemptions &amp; deductions optimized for your profile</li>
            <li>Choose best regime automatically</li>
            <li>100% legal &amp; compliant calculations</li>
          </ul>

          {/* goes to full calculator page */}
          <Link className="btn cta" to="/tax-reduction">
            TRY TAX CALCULATOR
          </Link>
        </div>
      </div>
    </section>
  );
}
