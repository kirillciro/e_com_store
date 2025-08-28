import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css"; // Ensure you have Tailwind CSS imported

import { BrowserRouter } from "react-router-dom"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </StrictMode>
);

