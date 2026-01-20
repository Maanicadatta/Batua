// src/pages/YourBatua.jsx

import React from "react";
import Chatbot from "../components/Chatbot";

const YourBatuaPage = () => {
  const suggestionItems = ["Suggestion 1", "Suggestion 2", "Suggestion 3"];

  return (
    <div className="your-batua-page">
      <header>
        {/* Spacer header – real nav is in TopNav */}
        <nav>{/* ... */}</nav>
      </header>

      <section
        className="your-batua-main"
        style={{
          minHeight: "calc(100vh - 80px)", // full-height feel
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "80px", // not stuck to navbar
          paddingBottom: "40px",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          Your Batua
        </h1>

        {/* Website-level Suggestions (NOT inside chatbot) */}
        <div
          style={{
            width: "100%",
            maxWidth: "880px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          {suggestionItems.map((label, idx) => (
            <button
              key={idx}
              type="button"
              style={{
                backgroundColor: "#F4F6FC",
                borderRadius: "16px",
                padding: "10px 14px",
                border: "1px solid #E1E5F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                cursor: "pointer",
                color: "#111827",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              <span>{label}</span>
              <span
                style={{
                  fontSize: "16px",
                  color: "#6B7280",
                }}
              >
                ›
              </span>
            </button>
          ))}
        </div>

        {/* Chatbot – centered, wider on laptop */}
        <section
          className="chatbot-wrapper"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Chatbot />
        </section>
      </section>
    </div>
  );
};

export default YourBatuaPage;
