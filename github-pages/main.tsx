import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BitIslandApp } from "@/components/BitIslandApp";
import "@/app/globals.css";
import "./pages.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing GitHub Pages application root");
}

createRoot(root).render(
  <StrictMode>
    <BitIslandApp />
  </StrictMode>,
);
