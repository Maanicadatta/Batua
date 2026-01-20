import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import React, { useState } from "react";

export default function AuthModal({ open, onClose }) {
  if (!open) return null;
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [error, setError] = useState("");

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px",
  };

  const modal = {
    width: "100%",
    maxWidth: "420px",
    borderRadius: "18px",
    background: "#fff",
    border: "1px solid #E5E7EB",
    boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
    overflow: "hidden",
  };

  const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid #E5E7EB",
  };

  const body = { padding: "16px" };

  const title = { fontSize: "18px", fontWeight: 800, margin: 0 };

  const closeBtn = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "22px",
    lineHeight: 1,
  };

  const button = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: "12px",
    border: "1px solid #111827",
    background: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "10px",
  };

  const dividerRow = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "14px 0",
  };

  const line = { height: "1px", background: "#E5E7EB", flex: 1 };
  const or = { fontSize: "12px", color: "#6B7280", fontWeight: 700 };

  const input = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    outline: "none",
    fontSize: "14px",
    marginBottom: "10px",
  };

  const primary = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: "12px",
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    marginTop: "4px",
  };

  const hint = {
    fontSize: "12px",
    color: "#6B7280",
    marginTop: "10px",
    lineHeight: 1.4,
  };

  const stop = (e) => e.stopPropagation();

  const onProviderClick = async (provider) => {
    setError("");

    try {
      if (provider === "google") {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Google login success:", result.user.email);
        onClose();
        return;
      }

      // Apple/Facebook not wired yet
      setError(`${provider} login coming soon`);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Login failed");
    }
  };

  const onEmailContinue = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Basic guard
      if (!emailOrPhone.includes("@")) {
        setError("Please enter an email (phone login not added yet).");
        return;
      }
      if (!password) {
        setError("Please enter a password.");
        return;
      }

      if (mode === "signup") {
        const result = await createUserWithEmailAndPassword(
          auth,
          emailOrPhone.trim(),
          password
        );
        console.log("Signup success:", result.user.email);
      } else {
        const result = await signInWithEmailAndPassword(
          auth,
          emailOrPhone.trim(),
          password
        );
        console.log("Login success:", result.user.email);
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Email login failed");
    }
  };


  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={stop}>
        <div style={header}>
          <h3 style={title}>Log in or sign up</h3>
          <button aria-label="Close" style={closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={body}>
          <button style={button} onClick={() => onProviderClick("google")}>
            <span>🔵</span> Continue with Google
          </button>

          <button style={button} onClick={() => onProviderClick("apple")}>
            <span></span> Continue with Apple
          </button>

          <button style={button} onClick={() => onProviderClick("facebook")}>
            <span>🔷</span> Continue with Facebook
          </button>

          <div style={dividerRow}>
            <div style={line} />
            <div style={or}>OR</div>
            <div style={line} />
          </div>

          <form onSubmit={onEmailContinue}>
                       <input
              style={input}
              placeholder="Email"
              type="email"
              autoComplete="email"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />

            <input
              style={input}
              placeholder="Password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? (
              <div style={{ color: "#B91C1C", fontSize: "12px", marginBottom: "10px" }}>
                {error}
              </div>
            ) : null}

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <button
                type="button"
                style={{
                  ...button,
                  marginBottom: 0,
                  borderColor: mode === "login" ? "#111827" : "#E5E7EB",
                  background: mode === "login" ? "#111827" : "#fff",
                  color: mode === "login" ? "#fff" : "#111827",
                }}
                onClick={() => setMode("login")}
              >
                Log in
              </button>

              <button
                type="button"
                style={{
                  ...button,
                  marginBottom: 0,
                  borderColor: mode === "signup" ? "#111827" : "#E5E7EB",
                  background: mode === "signup" ? "#111827" : "#fff",
                  color: mode === "signup" ? "#fff" : "#111827",
                }}
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </div>

            <button type="submit" style={primary}>
              Continue
            </button>
          </form>

          <div style={hint}>
            By continuing, you agree to Batua.ai’s Terms & Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
