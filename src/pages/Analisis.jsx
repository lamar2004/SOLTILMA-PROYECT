import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Slide,
  IconButton,
} from "@mui/material";
import {
  WbSunny,
  Umbrella,
  DeviceThermostat,
  Opacity,
  OpenWith,
  Close,
  Announcement,
  Close as CloseIcon,
} from "@mui/icons-material";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase.js";

export default function Analisis({ usuario }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [mostrarMensaje, setMostrarMensaje] = useState(true);

  const idEsp = usuario?.id_esp;

  // ESCUCHAR DATOS DEL TENDEDERO
  useEffect(() => {
    if (!idEsp) {
      setCargando(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "tendederos", idEsp), (docSnap) => {
      if (docSnap.exists()) {
        setDatos(docSnap.data());
      }
      setCargando(false);
    });

    return () => unsub();
  }, [idEsp]);

  // ESCUCHAR MENSAJE GLOBAL
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "avisos", "global"), (docSnap) => {
      if (docSnap.exists() && docSnap.data().texto) {
        setMensajeGlobal(docSnap.data().texto);
        setMostrarMensaje(true);
      } else {
        setMensajeGlobal("");
      }
    });
    return () => unsub();
  }, []);

  const manejarComando = async (accion) => {
    if (!idEsp) return;
    setEnviando(true);

    const nuevosDatos = {
      lluvia: accion === "CERRAR",
      posicion_tendedero: accion === "CERRAR" ? "cerrado" : "abierto",
      ultima_actualizacion: new Date().toISOString(),
      comando_manual: accion,
      timestamp_comando: new Date().toISOString(),
    };

    try {
      await updateDoc(doc(db, "tendederos", idEsp), nuevosDatos);
      setDatos((prev) => ({ ...prev, ...nuevosDatos }));
    } catch (err) {
      alert("Error al enviar comando");
    }
    setEnviando(false);
  };

  if (cargando) {
    return (
      <Box sx={{ textAlign: "center", mt: 15 }}>
        <CircularProgress size={70} />
        <Typography sx={{ mt: 3, fontSize: "1.3rem" }}>
          Conectando con tu tendedero...
        </Typography>
      </Box>
    );
  }

  if (!idEsp) return <Alert severity="error">No tienes ID ESP asignado</Alert>;
  if (!datos)
    return (
      <Alert severity="warning">Esperando datos del tendedero {idEsp}...</Alert>
    );

  const lloviendo = datos.lluvia === true;
  const posicion = datos.posicion_tendedero || "desconocido";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      {/* MENSAJE GLOBAL */}
      {mensajeGlobal && mostrarMensaje && (
        <Slide direction="down" in={mostrarMensaje}>
          <Alert
            severity="info"
            action={
              <IconButton
                size="small"
                onClick={() => setMostrarMensaje(false)}
                color="inherit"
              >
                <CloseIcon />
              </IconButton>
            }
            sx={{
              mb: 3,
              fontSize: "1.2rem",
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              color: "white",
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <Announcement sx={{ mr: 1 }} />
            <strong>AVISO:</strong> {mensajeGlobal}
          </Alert>
        </Slide>
      )}

      {/* TÍTULO */}
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#fffafaff",
          fontSize: { xs: "2.2rem", md: "3.5rem" },
        }}
      >
        Mi Tendedero Inteligente
      </Typography>
      <Typography align="center" color="text.secondary" sx={{ mb: 5 }}>
        ID: <strong>{idEsp}</strong>
      </Typography>

      {/* ESTADO PRINCIPAL */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper
            elevation={16}
            sx={{
              p: { xs: 5, md: 8 },
              textAlign: "center",
              background: lloviendo
                ? "linear-gradient(135deg, #1565c0, #0d47a1)"
                : "linear-gradient(135deg, #ffb300, #ff8f00)",
              color: "white",
              borderRadius: 6,
            }}
          >
            {lloviendo ? (
              <Umbrella sx={{ fontSize: { xs: 100, md: 160 } }} />
            ) : (
              <WbSunny sx={{ fontSize: { xs: 100, md: 160 } }} />
            )}
            <Typography
              variant="h2"
              sx={{
                mt: 3,
                fontWeight: "bold",
                fontSize: { xs: "2.5rem", md: "4.5rem" },
              }}
            >
              {lloviendo ? "¡ESTÁ LLOVIENDO!" : "CIELO DESPEJADO"}
            </Typography>
          </Paper>
        </Grid>

        {/* TEMPERATURA Y HUMEDAD */}
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={10}
            sx={{ p: 4, textAlign: "center", borderRadius: 4 }}
          >
            <DeviceThermostat sx={{ fontSize: 70, color: "#f44336" }} />
            <Typography variant="h6">Temperatura</Typography>
            <Typography variant="h3" fontWeight="bold">
              {datos.temperatura ?? "--"}°C
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            elevation={10}
            sx={{ p: 4, textAlign: "center", borderRadius: 4 }}
          >
            <Opacity sx={{ fontSize: 70, color: "#2196f3" }} />
            <Typography variant="h6">Humedad del Aire</Typography>
            <Typography variant="h3" fontWeight="bold">
              {datos.humedad ?? "--"}%
            </Typography>
          </Paper>
        </Grid>

        {/* ESTADO DEL TENDEDERO */}
        <Grid item xs={12}>
          <Paper
            elevation={12}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              background: posicion === "abierto" ? "#e8f5e9" : "#ffebee",
              border: `8px solid ${
                posicion === "abierto" ? "#4caf50" : "#f44336"
              }`,
            }}
          >
            <Typography variant="h5" gutterBottom color="text.secondary">
              Estado Actual del Tendedero
            </Typography>
            <Typography
              variant="h1"
              fontWeight="bold"
              color={posicion === "abierto" ? "#2e7d32" : "#d32f2f"}
              sx={{ fontSize: { xs: "3rem", md: "6rem" } }}
            >
              {posicion.toUpperCase()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* BOTONES */}
      <Paper
        elevation={12}
        sx={{
          mt: 6,
          p: { xs: 4, md: 6 },
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Control Manual
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 4,
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            size="large"
            color="success"
            startIcon={<OpenWith sx={{ fontSize: 40 }} />}
            onClick={() => manejarComando("ABRIR")}
            disabled={enviando || posicion === "abierto"}
            sx={{
              minWidth: 280,
              py: 4,
              fontSize: "1.6rem",
              fontWeight: "bold",
            }}
          >
            SACAR ROPA
          </Button>

          <Button
            variant="contained"
            size="large"
            color="error"
            startIcon={<Close sx={{ fontSize: 40 }} />}
            onClick={() => manejarComando("CERRAR")}
            disabled={enviando || posicion === "cerrado"}
            sx={{
              minWidth: 280,
              py: 4,
              fontSize: "1.6rem",
              fontWeight: "bold",
            }}
          >
            GUARDAR ROPA
          </Button>
        </Box>

        {enviando && (
          <Typography sx={{ mt: 3, fontSize: "1.2rem", color: "primary.main" }}>
            Actualizando estado...
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
