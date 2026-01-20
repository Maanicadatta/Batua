// src/App.jsx
import React, { useState } from "react";
import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopNav from "./components/TopNav.jsx";
import Footer from "./components/Footer.jsx";

import Landing from "./pages/Landing.jsx";
import WhyBatua from "./pages/WhyBatua.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";

import Budgeting from "./pages/Budgeting.jsx";
import Investing from "./pages/Investing.jsx";
import StocksPage from "./pages/StocksPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";   // 👈 IMPORTANT
import MutualFundsPage from "./pages/MutualFundsPage.jsx";
import FNOPage from "./pages/FNOPage.jsx";
import TaxReduction from "./pages/TaxReduction.jsx";
import TaxReductionPage from "./pages/TaxReductionPage.jsx";

import BudgetingPage from "./pages/BudgetingPage.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import YourBatua from "./pages/YourBatua.jsx";
import { enableAuthPersistence } from "./auth/persistence";

enableAuthPersistence().catch(console.error);

function Home() {
  return (
    <>
      <Landing />
      <WhyBatua />
      <HowItWorks />
      <Investing />
      <Budgeting />
      <TaxReduction />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/budgeting" element={<BudgetingPage />} />
          <Route path="/mutual-funds" element={<MutualFundsPage />} />

<Route path="/stocks" element={<StocksPage />} />     
<Route path="/tax-reduction" element={<TaxReductionPage />} />
        <Route path="/payments" element={<PaymentsPage />} /> {/* NEW ROUTE */}
        <Route path="/fno" element={<FNOPage />} />
        <Route path="/get-started" element={<Onboarding />} />
        <Route path="/your-batua" element={<YourBatua />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
