// src/components/Footer.jsx
import React from "react";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const { pathname } = useLocation();
  const showCta = pathname === "/";

  return (
    <footer className="footer" id="footer">
      {showCta && (
        <div className="cta-band">
          <h2>Ready to sort your month—budget, invest, cut tax?</h2>
          <a className="btn outline" href="#home">START NOW!</a>
        </div>
      )}

      <div className="foot-links">
        <span>Designed and Developed By Batua.ai</span>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Disclaimers &amp; Disclosures</a>
        <span className="ig" aria-label="Instagram" />
      </div>
    </footer>
  );
}
