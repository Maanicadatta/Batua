// src/pages/WhyBatua.jsx
import React from "react";
import { Link } from "react-router-dom";

const items = [
  { 
  title: "One monthly plan",
  description: "Everything in one place—spend, emergency, invest, tax.",
  icon: "/img/new_icon_batua.png"
},

  {
    title: "Money auto-sorted",
    description: "Smart buckets with plan vs actual and gentle reminders.",
    icon: "/img/icon2_batua.png"
  },
  {
    title: "Emergency fund first",
    description: "Tailored amounts with safe FD/SGB suggestions (laddered).",
    icon: "/img/icon3_batua.png"
  },
  {
  title: "Invest with guardrails",
  description: "Portfolio match checks, sector/stock caps, compare stocks/MFs.",
  icon: "/img/correct_icon_batua.png"
}
,
  {
    title: "Legal tax savings",
    description: "Old vs new regime; eligible deductions surfaced—pay what’s due.",
    icon: "/img/icon5_batua.png"
  },
  {
    title: "Time saved, zero spreadsheets",
    description: "Quick setup; monthly plan updates itself.",
    icon: "/img/icon6_batua.png"
  }
];

export default function WhyBatua() {
  return (
    <section className="why" id="why">
      <h2 className="section-title">Why Batua</h2>
      <div className="grid-3">
        {items.map((it) => (
          <div key={it.title} className="card hover-pop">
            <img src={it.icon} alt={it.title} className="icon-img" />
<h3>{it.title}</h3>
<p>{it.description}</p>


           
          </div>
        ))}
      </div>
    </section>
  );
}
