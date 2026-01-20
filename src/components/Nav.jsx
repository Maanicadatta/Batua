import React from "react";
import useAuthUser from "../auth/useAuthUser";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function getInitials(user) {
  const name = user?.displayName?.trim();
  const email = user?.email?.trim();
  const base = name || email || "";
  if (!base) return "?";
  return base[0].toUpperCase();
}

export default function Nav({ onAvatarClick }) {
  const { user, loading } = useAuthUser();

  const photo = user?.photoURL;
  const initials = user ? getInitials(user) : null;

  return (
    <header className="nav">
      <div className="logo-wallet" aria-label="Batua" />
      <nav className="nav-links">
        <a href="#investing">INVESTING</a>
        <a href="#budgeting">BUDGETING</a>
        <a href="#tax">TAX REDUCTION</a>
      </nav>

      {/* Avatar area */}
      <button
        type="button"
        className="avatar"
        onClick={onAvatarClick}
        title={user ? (user.email || user.displayName || "Account") : "Log in"}
        style={{
          width: 38,
          height: 38,
          borderRadius: 999,
          border: "1px solid #E5E7EB",
          background: "#fff",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {loading ? (
          <span style={{ fontSize: 12, color: "#6B7280" }}>…</span>
        ) : user && photo ? (
          <img
            src={photo}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : user ? (
          <span style={{ fontWeight: 800 }}>{initials}</span>
        ) : (
          // fallback icon if logged out (you can keep your CSS icon if you want)
          <span style={{ fontWeight: 800 }}>👤</span>
        )}
      </button>

      {/* Optional: quick sign out button (remove if you don't want it) */}
      {/* {user ? (
        <button onClick={() => signOut(auth)} style={{ marginLeft: 10 }}>
          Logout
        </button>
      ) : null} */}
    </header>
  );
}
