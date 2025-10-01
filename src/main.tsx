import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 📌 estilos globales de Leaflet y ExtraMarkers
import "leaflet/dist/leaflet.css";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
