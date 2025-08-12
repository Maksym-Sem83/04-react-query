// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import { Toaster } from "react-hot-toast";
import "modern-normalize/modern-normalize.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center" reverseOrder={false} />
  </React.StrictMode>
);
