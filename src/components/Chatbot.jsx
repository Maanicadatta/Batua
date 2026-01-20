// src/components/Chatbot.jsx
import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]); // only user questions for now
  const inputRef = useRef(null);

  const quickQuestions = [
    "How do I track my savings?",
    "How do I set a SIP goal?",
    "How do I reduce my taxes?",
  ];
  const SPECIAL_SIP_QUESTION = "How do I set a SIP goal?";
const SPECIAL_SIP_ANSWER =
  "To set a SIP goal, think of what you want to save for, decide how long you have, decide the amount you want to reach, and then check how much you need to invest every month to get there. That's all you need to do.";


  const faqs = [
    "Between Nifty Bank, Nifty IT and Nifty Pharma which sector had the highest returns in the time period of Covid pandemic?",
    "What is the best way to start investing in stocks as a beginner?",
    "How do I know which stocks are worth investing in?",
    "How much money should I invest in stocks each month?",
    "What is the difference between long-term and short-term stock investing?",
    "How risky is stock investing for first-time investors?",
    "How can I create a realistic monthly budget?",
    "What is the ideal way to split income between expenses and savings?",
    "How do I track my spending effectively?",
    "How can I reduce unnecessary expenses without cutting essentials?",
    "What budgeting method works best for consistent saving?"
  ];

  
    const fetchBotReply = async (question) => {
      console.log(question)
  try {
    const url = `https://batua-ai-0qo6.onrender.com/query?question=${encodeURIComponent(
      question
    )}`;

    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("API error (non-OK status):", res.status, text);
      throw new Error("API failed with status " + res.status);
    }

    const data = await res.json();
    console.log(data.answer)
    console.log("API success:", data);
    return data.answer || "Sorry, I couldn't find an answer for that.";
  } catch (err) {
    console.error("Error fetching bot reply:", err);
    return "There was some error at our end";
  }
};


  const handleSuggestionClick = async (text) => {
  // If it is the SIP question, directly add user + bot messages
  if (text === SPECIAL_SIP_QUESTION) {
    const userMsg = { role: "user", text };
    const botMsg = { role: "bot", text: SPECIAL_SIP_ANSWER };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputValue("");

    // no need to call the API or focus the input
    return;
  }

  // default behaviour for other quick questions
  setInputValue(text);
  if (inputRef.current) inputRef.current.focus();
};


const handleSend = async () => {
  const trimmed = inputValue.trim();
  if (!trimmed) return;

  // 1) Add user message immediately
  const userMsg = { role: "user", text: trimmed };
  setMessages((prev) => [...prev, userMsg]);
  setInputValue("");

  // 2) Get answer from API
  const botText = await fetchBotReply(trimmed);

  // 3) Add bot message
  const botMsg = { role: "bot", text: botText };
  setMessages((prev) => [...prev, botMsg]);
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const COLORS = {
    primary: "#4D8FD9",
    primaryDark: "#2558A5",
    chipBg: "#E8F1FF",
    border: "#E1E5F0",
    textMuted: "#6B7280",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "880px", // wider for laptop
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        padding: "20px 22px 18px",
        boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
        border: `1px solid ${COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.textMuted,
            }}
          >
            Batua.ai Assistant
          </div>
          <div
            style={{
              marginTop: "4px",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            Welcome back, Buck 👋
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: COLORS.textMuted,
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              backgroundColor: "#10B981",
            }}
          />
          <span>Online</span>
        </div>
      </div>

      {/* Sub text */}
      <div
        style={{
          fontSize: "13px",
          color: COLORS.textMuted,
          marginTop: "-4px",
        }}
      >
        Ask anything about your money, or start with a quick question below.
      </div>

      {/* Quick question chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "2px",
        }}
      >
        {quickQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSuggestionClick(q)}
            style={{
              borderRadius: "999px",
              border: `1px solid ${COLORS.primary}`,
              backgroundColor: COLORS.chipBg,
              color: COLORS.primaryDark,
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
              }}
            >
              💬
            </span>
            {q}
          </button>
        ))}
      </div>

      {/* Chat history */}
      <div
        style={{
          backgroundColor: "#F7F8FF",
          borderRadius: "16px",
          padding: "10px 12px",
          maxHeight: "4000px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          border: `1px solid ${COLORS.border}`,
          marginTop: "4px",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: "13px",
              textAlign: "center",
              padding: "6px 4px 2px",
            }}
          >
            Your conversation with Batua.ai will appear here.
          </div>
        )}

           {messages.map((msg, index) => (
          <div
            key={index}
            style={{
  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
  background:
    msg.role === "user"
      ? "linear-gradient(135deg, #4D8FD9 0%, #2558A5 100%)"
      : "#EDF2FF",
  color: msg.role === "user" ? "#fff" : "#111827",
  borderRadius:
    msg.role === "user"
      ? "18px 18px 4px 18px"
      : "18px 18px 18px 4px",
  padding: "8px 12px",
  maxWidth: "80%",
  fontSize: "14px",
  boxShadow:
    msg.role === "user"
      ? "0 4px 10px rgba(37,88,165,0.35)"
      : "0 2px 6px rgba(0,0,0,0.08)",
  whiteSpace: "pre-line",
  textAlign: "left"   // ✅ ADD THIS
}}

          >
<ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}

      </div>

      {/* Input row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "6px",
        }}
      >
        <button
          type="button"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "999px",
            border: `1px solid ${COLORS.border}`,
            backgroundColor: "#F9FAFB",
            color: COLORS.primary,
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          +
        </button>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            borderRadius: "999px",
            border: `1px solid ${COLORS.border}`,
            backgroundColor: "#F9FAFB",
            padding: "0 4px 0 10px",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "8px 0",
              fontSize: "14px",
              background: "transparent",
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: COLORS.primary,
              cursor: "pointer",
              fontSize: "16px",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "4px",
            }}
            aria-label="Send"
          >
            ↗
          </button>
        </div>
      </div>

      {/* FAQ band */}
      <details
        style={{
          marginTop: "6px",
          borderRadius: "16px",
          padding: "8px 12px",
          backgroundColor: "#F4F6FC",
          cursor: "pointer",
        }}
      >
        <summary
          style={{
            listStyle: "none",
            fontWeight: 600,
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#111827",
          }}
        >
          <span
            style={{
              fontSize: "14px",
            }}
          >
            ❓
          </span>
          <span>FAQs about Batua.ai</span>
        </summary>

        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {faqs.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSuggestionClick(q)}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                background: "transparent",
                color: "#374151",
                padding: "4px 0",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
