import React from "react";
import { Link } from "react-router-dom"; // <-- add at the top with other imports
export default function Landing(){
  return (
    <header className="hero">
      <div className="hero-inner">
        <h1 className="brand">Batua.ai</h1>
        <p className="strap">Spend • Save • Invest</p>

        {/* No navigation on click */}
        



<Link className="btn cta" to="/get-started">GET STARTED</Link>

      </div>
    </header>
  );
}
