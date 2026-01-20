// src/main.jsx
import { enableAuthPersistence } from "./auth/persistence";

enableAuthPersistence().catch(console.error);

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
