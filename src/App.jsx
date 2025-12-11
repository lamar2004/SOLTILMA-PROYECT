import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import Header from "./pages/Header.jsx";
import Datos from "./pages/Datos.jsx";
import Clima from "./pages/Clima.jsx";
import Analisis from "./pages/Analisis.jsx";
import DatosPersonales from "./pages/DatosPersonales.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Login from "./pages/login.jsx";
import Registro from "./pages/Registro.jsx";

import HeaderPrincipal from "./components/HeaderPrincipal.jsx";
import Home from "./components/Home.jsx";
import Footer from "./components/Footer.jsx";

const MainLayoutNoAuth = () => (
  <>
    <HeaderPrincipal usuario={null} onLogout={() => {}} />
    <Home />
    <Footer />
  </>
);

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("usuario");
    if (saved) {
      try {
        setUsuario(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  const handleLogin = (data) => {
    localStorage.setItem("usuario", JSON.stringify(data));
    setUsuario(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <Router>
      <Routes>
        {/* 1. RUTA PRINCIPAL */}
        <Route
          path="/"
          element={
            usuario ? (
              <Navigate
                to={usuario.rol === "ADMIN" ? "/admin" : "/analisis"}
                replace
              />
            ) : (
              <MainLayoutNoAuth />
            )
          }
        />

        {/* 2. LOGIN Y REGISTRO */}
        <Route
          path="/login"
          element={
            usuario ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/registro"
          element={usuario ? <Navigate to="/" replace /> : <Registro />}
        />

        {/* 3. RUTAS PROTEGIDAS (solo si hay usuario) */}
        {usuario ? (
          <>
            {/* LAYOUT GENERAL (Header + contenido) */}
            <Route
              path="/*"
              element={
                <>
                  <Header usuario={usuario} onLogout={handleLogout} />
                  <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Routes>
                      {/* USUARIO NORMAL */}
                      <Route
                        path="/analisis"
                        element={<Analisis usuario={usuario} />}
                      />
                      <Route
                        path="/datos-personales"
                        element={<DatosPersonales usuario={usuario} />}
                      />
                      <Route
                        path="/clima"
                        element={<Clima usuario={usuario} />}
                      />

                      {/* SOLO ADMIN */}
                      {usuario.rol === "ADMIN" ? (
                        <>
                          <Route
                            path="/datos"
                            element={<Datos usuario={usuario} />}
                          />
                          <Route path="/admin" element={<AdminPanel />} />
                          <Route index element={<AdminPanel />} />{" "}
                          {/* opcional */}
                        </>
                      ) : (
                        <>
                          <Route
                            path="/datos"
                            element={<Navigate to="/analisis" replace />}
                          />
                          <Route
                            path="/admin"
                            element={<Navigate to="/analisis" replace />}
                          />
                        </>
                      )}

                      {/* REDIRECCIÓN POR DEFECTO */}
                      <Route
                        path="*"
                        element={
                          <Navigate
                            to={
                              usuario.rol === "ADMIN" ? "/admin" : "/analisis"
                            }
                            replace
                          />
                        }
                      />
                    </Routes>
                  </Box>
                </>
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}
