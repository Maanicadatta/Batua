// src/components/TopNav.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import useAuthUser from "../auth/useAuthUser";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function TopNav() {
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, loading } = useAuthUser();

  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };

    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const photo = user?.photoURL;
  const label = user
    ? user.displayName || user.email || "Account"
    : "Log in or sign up";
  const initial = (
    user?.displayName?.trim()?.[0] ||
    user?.email?.trim()?.[0] ||
    "?"
  ).toUpperCase();

  const handleAvatarClick = () => {
    if (user) setMenuOpen((v) => !v); // logged in -> toggle menu
    else setAuthOpen(true); // logged out -> open modal
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="nav">
        <Link
          to="/your-batua"
          className="logo-wallet"
          aria-label="Your Batua wallet"
        />

        <div className="nav-links">
          <NavLink to="/stocks" className={({ isActive }) => (isActive ? "active" : undefined)}>
            STOCKS
          </NavLink>
          <NavLink to="/mutual-funds" className={({ isActive }) => (isActive ? "active" : undefined)}>
            MUTUAL FUNDS
          </NavLink>
          <NavLink to="/fno" className={({ isActive }) => (isActive ? "active" : undefined)}>
            F&amp;O
          </NavLink>
          <NavLink to="/budgeting" className={({ isActive }) => (isActive ? "active" : undefined)}>
            BUDGETING
          </NavLink>
          <NavLink to="/payments" className={({ isActive }) => (isActive ? "active" : undefined)}>
            PAYMENTS
          </NavLink>
          <NavLink to="/tax-reduction" className={({ isActive }) => (isActive ? "active" : undefined)}>
            TAX REDUCTION
          </NavLink>
        </div>

        {/* pushes avatar to far right */}
        <div style={{ marginLeft: "auto", position: "relative" }} ref={menuRef}>
          <button
            type="button"
            onClick={handleAvatarClick}
            aria-label={label}
            title={label}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {loading ? (
              <div className="avatar" style={{ display: "grid", placeItems: "center" }}>
                …
              </div>
            ) : photo ? (
              <img className="avatar" src={photo} alt="Profile" referrerPolicy="no-referrer" />
            ) : user ? (
              <div className="avatar" style={{ display: "grid", placeItems: "center", fontWeight: 800 }}>
                {initial}
              </div>
            ) : (
              <img className="avatar" src="/img/profile_pic.png" alt="Profile" />
            )}
          </button>

          {/* dropdown */}
          {user && menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 10px)",
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
                minWidth: "200px",
                overflow: "hidden",
                zIndex: 9999,
              }}
            >
              <div style={{ padding: "10px 12px", fontSize: 12, color: "#6B7280" }}>
                {user.email || user.displayName}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px",
                  border: "none",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
