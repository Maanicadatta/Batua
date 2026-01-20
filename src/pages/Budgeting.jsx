// src/pages/Budgeting.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Budgeting() {
  // slices from the mock
  const slices = [
    { label: "FD Amount", value: 62.5, color: "#74E6E7" },
    { label: "Investing", value: 25,   color: "#36B9C4" },
    { label: "Spendings", value: 12.5, color: "#2C7AA2" },
  ];

  // ---- pie sizing ----
  const SVG_W = 560;
  const SVG_H = 440;
  const PAD   = 140;
  const cx = 280, cy = 220, r = 180;
  const labelR = r + 84;
  const toRad = (deg) => (deg - 90) * (Math.PI / 180);

  const renderPie = () => (
    <svg
      className="pie"
      viewBox={`${-PAD} 0 ${SVG_W + PAD * 2} ${SVG_H}`}
      width="100%"
      height={SVG_H}
      preserveAspectRatio="xMidYMid meet"
    >
      {(() => {
        let acc = 0;
        return slices.map((s, i) => {
          const start = acc;
          const end = acc + (s.value / 100) * 360;
          acc = end;

          const x1 = cx + r * Math.cos(toRad(start));
          const y1 = cy + r * Math.sin(toRad(start));
          const x2 = cx + r * Math.cos(toRad(end));
          const y2 = cy + r * Math.sin(toRad(end));
          const largeArc = end - start > 180 ? 1 : 0;
          const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

          const mid = (start + end) / 2;
          const midRad = toRad(mid);
          const tx = cx + labelR * Math.cos(midRad);
          const ty = cy + labelR * Math.sin(midRad);
          const isRight = Math.cos(midRad) >= 0;
          const anchor = isRight ? "start" : "end";
          const dx = isRight ? 12 : -12;

          return (
            <g key={i}>
              <path d={path} fill={s.color} />
              <text
                x={tx + dx}
                y={ty}
                className="pie-label"
                textAnchor={anchor}
                dominantBaseline="middle"
              >
                <tspan dy="-0.45em">{s.label}</tspan>
                <tspan x={tx + dx} dy="1.25em">{s.value}%</tspan>
              </text>
            </g>
          );
        });
      })()}
    </svg>
  );

  return (
    <section className="feature feature-budget" id="budgeting">
      <div className="budget-grid">
        {/* LEFT: heading + bullets + CTA */}
        <div className="budget-copy">
          <h2 className="feature-title">BUDGETING</h2>
          <p className="feature-sub">Your month, mapped and managed</p>

          <ul className="checks ticks">
            <li>Create smart buckets—see spending vs plan in real time</li>
            <li>Tailored amounts for your Emergency Fund and safe FDs (laddered)</li>
            <li>Get a monthly “Invest ₹X” recommendation</li>
          </ul>

          <div className="budget-cta-wrap">
            <Link to="/budgeting" className="btn cta">
              TRY NOW <span className="arrow">›</span>
            </Link>
          </div>
        </div>

        {/* RIGHT: pie chart */}
        <div className="pie-wrap" aria-hidden="true">
          {renderPie()}
        </div>
      </div>
    </section>
  );
}
