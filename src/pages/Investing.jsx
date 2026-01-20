// src/pages/Investing.jsx
import React from "react";
import { Link } from "react-router-dom";

function Donut({ value = 70, size = 220, label = "Match" }) {
  const r = size / 2 - 18;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg className="donut" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#0C3C4B" strokeWidth="26" fill="none" />
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke="#1BB3C6" strokeWidth="26" fill="none" strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="donut-big">
        {value}% <tspan x="50%" dy="1.3em" className="donut-small">{label}</tspan>
      </text>
    </svg>
  );
}

export default function Investing() {
  return (
    <section className="feature feature-invest" id="investing">
      <div className="invest-grid">
        {/* LEFT: donuts */}
        <div className="donuts">
          <div className="donut-wrap">
            <span className="badge bubble">Better Fit</span>
            <Donut value={70} />
          </div>
          <div className="donut-wrap">
            <Donut value={55} />
          </div>
        </div>

        {/* RIGHT: heading + bullets + CTA */}
        <div className="invest-copy">
          <h2 className="feature-title">INVESTING</h2>
          <p className="feature-sub">Smart invests, zero guesswork</p>

          <ul className="checks ticks">
            <li>Check any BSE stock/MF for portfolio match</li>
            <li>Risk &amp; diversification calculated; compare picks side-by-side</li>
            <li>SIP amount suggestions with clear reasons</li>
          </ul>

                    <Link className="btn cta" to="/investing" style={{ marginTop: 24 }}>
            TRY NOW
          </Link>


        </div>
      </div>
    </section>
  );
}
