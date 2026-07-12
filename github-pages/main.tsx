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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL,
    });
  });
}
