// src/pages/HowItWorks.jsx
import React, { useEffect, useRef, useState } from "react";

export default function HowItWorks() {
  const steps = [
    { t: "Start the quick setup", d: "Enter salary in hand, fixed bills, usual spend, and your emergency-fund goal. (Bank link optional.)" },
    { t: "Taxes, estimated", d: "We compare old vs new regimes—or you enter your own numbers—and surface unused deductions you qualify for." },
    { t: "Auto-allocation", d: "Your month is split into buckets (essentials), Emergency Fund / safe FDs (laddered), and SIP investing—with clear ₹ amounts." },
    { t: "Pick Smart Investments", d: "Check and compare BSE stocks/MFs for portfolio match; get SIP suggestions aligned to your risk and goals." },
    { t: "Track & adjust", d: "See plan vs actual, get gentle reminders, and tweak anytime—next month updates automatically. Only legal, compliant methods." },
  ];

  // --- hooks must come before return ---
  const gridRef = useRef(null);
  const itemRefs = useRef([]); // will be filled by the map below
  const [activeIdx, setActiveIdx] = useState(0);
  const [indicatorTop, setIndicatorTop] = useState("0px");

  useEffect(() => {
    if (!gridRef.current) return;

    const opts = { root: null, rootMargin: "-30% 0px -50% 0px", threshold: 0.0 };
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (visible) {
        const idx = Number(visible.target.dataset.index);
        setActiveIdx(idx);

        // position the dot at the center of the visible item
        const gridTop = gridRef.current.getBoundingClientRect().top + window.scrollY;
        const rect = visible.target.getBoundingClientRect();
        const mid = rect.top + window.scrollY + rect.height / 2;
        setIndicatorTop(`${mid - gridTop}px`);
      }
    }, opts);

    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  return (
    <section className="how how-alt">
      <h2 className="how-title">How It Works</h2>

      <div className="how-grid" ref={gridRef}>
        {/* center rail + single moving dot */}
        <span className="how-rail" aria-hidden />
        <span className="how-dot" aria-hidden style={{ top: indicatorTop }} />

        {steps.map((s, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <div
              className={`how-item ${side} ${i === activeIdx ? "active" : ""}`}
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              data-index={i}
            >
              <div className="how-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="how-copy">
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
