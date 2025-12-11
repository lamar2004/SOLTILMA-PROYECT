import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "../src/css/Clima.css";
import "leaflet/dist/leaflet.css";

const Theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#acacadff",
    },
    secondary: {
      main: "#455250ff",
    },
    background: { default: "#517caeff" },
    botonesHeader: { main: "#a32525ff" },
  },
});

// main.jsx – AÑADE ESTO AL FINAL (antes del createRoot)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registrado:", registration);
      })
      .catch((err) => {
        console.log("Error al registrar Service Worker:", err);
      });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
