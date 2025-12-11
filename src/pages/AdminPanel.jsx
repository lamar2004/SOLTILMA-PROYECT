import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  Alert,
  Divider,
} from "@mui/material";
import {
  People,
  OnlinePrediction,
  WarningAmber,
  ErrorOutline,
  Send,
} from "@mui/icons-material";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase.js";

// FUNCIÓN SEGURA PARA FECHAS
const formatearFecha = (timestamp) => {
  if (!timestamp) return "Nunca";
  try {
    if (timestamp.toDate) return timestamp.toDate().toLocaleString();
    if (typeof timestamp === "string")
      return new Date(timestamp).toLocaleString();
    return "Nunca";
  } catch (e) {
    return "Nunca";
  }
};

export default function AdminPanel() {
  const [estadisticas, setEstadisticas] = useState({
    usuariosTotales: 0,
    tendederosActivos: 0,
    lloviendoAhora: 0,
    abiertosConLluvia: 0,
  });
  const [tendederos, setTendederos] = useState([]);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuariosUnsub = onSnapshot(collection(db, "usuarios"), (snap) => {
      setEstadisticas((prev) => ({ ...prev, usuariosTotales: snap.size }));
    });

    const tendederosUnsub = onSnapshot(collection(db, "tendederos"), (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTendederos(lista);

      const ahora = Date.now();
      const hace30min = ahora - 30 * 60 * 1000;

      let activos = 0;
      let lloviendo = 0;
      let abiertosConLluvia = 0;

      lista.forEach((t) => {
        let ultimaTime = 0;
        if (t.ultima_actualizacion) {
          if (t.ultima_actualizacion.toDate)
            ultimaTime = t.ultima_actualizacion.toDate().getTime();
          else if (typeof t.ultima_actualizacion === "string")
            ultimaTime = new Date(t.ultima_actualizacion).getTime();
        }

        if (ultimaTime > hace30min) activos++;
        if (t.lluvia === true) {
          lloviendo++;
          if ((t.posicion_tendedero || "").toLowerCase() === "abierto")
            abiertosConLluvia++;
        }
      });

      setEstadisticas((prev) => ({
        ...prev,
        tendederosActivos: activos,
        lloviendoAhora: lloviendo,
        abiertosConLluvia,
      }));
      setCargando(false);
    });

    return () => {
      usuariosUnsub();
      tendederosUnsub();
    };
  }, []);

  // ENVIAR MENSAJE GLOBAL
  const enviarMensajeGlobal = async () => {
    if (!mensajeGlobal.trim()) {
      alert("Escribe un mensaje");
      return;
    }

    try {
      await setDoc(doc(db, "avisos", "global"), {
        texto: mensajeGlobal.trim(),
        fecha: serverTimestamp(),
      });
      alert("¡Mensaje enviado a todos los usuarios!");
      setMensajeGlobal("");
    } catch (e) {
      alert("Error al enviar mensaje");
    }
  };

  // COMANDO GLOBAL (EMERGENCIA)
  const comandoGlobal = async (comando) => {
    if (!confirm(`¿Enviar "${comando}" a TODOS los tendederos?`)) return;

    const batch = writeBatch(db);
    tendederos.forEach((t) => {
      batch.set(
        doc(db, "tendederos", t.id),
        {
          comando_manual: comando,
          timestamp_comando: serverTimestamp(),
        },
        { merge: true }
      );
    });
    await batch.commit();
    alert(`Comando "${comando}" enviado a ${tendederos.length} tendederos`);
  };

  if (cargando) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5">
          Cargando panel de administración...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h3" gutterBottom align="center" color="#fef6f6ff">
        Panel de Administrador
      </Typography>

      {/* ESTADÍSTICAS */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", background: "#e3f2fd" }}>
            <People sx={{ fontSize: 50, color: "#1976d2" }} />
            <Typography variant="h4" fontWeight="bold">
              {estadisticas.usuariosTotales}
            </Typography>
            <Typography>Usuarios</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", background: "#e8f5e9" }}>
            <OnlinePrediction sx={{ fontSize: 50, color: "#4caf50" }} />
            <Typography variant="h4" fontWeight="bold">
              {estadisticas.tendederosActivos}
            </Typography>
            <Typography>Activos</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", background: "#fff3e0" }}>
            <WarningAmber sx={{ fontSize: 50, color: "#ff9800" }} />
            <Typography variant="h4" fontWeight="bold">
              {estadisticas.lloviendoAhora}
            </Typography>
            <Typography>Lloviendo</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", background: "#ffebee" }}>
            <ErrorOutline sx={{ fontSize: 50, color: "#f44336" }} />
            <Typography variant="h4" fontWeight="bold">
              {estadisticas.abiertosConLluvia}
            </Typography>
            <Typography>Abiertos con lluvia</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ALERTA + BOTÓN DE EMERGENCIA */}
      {estadisticas.abiertosConLluvia > 0 && (
        <Alert severity="error" sx={{ mb: 4 }}>
          ¡ALERTA! Hay {estadisticas.abiertosConLluvia} tendedero(s) abierto(s)
          mientras llueve.
          <Button
            color="error"
            variant="contained"
            sx={{ ml: 2 }}
            onClick={() => comandoGlobal("CERRAR")}
          >
            GUARDAR TODOS AHORA
          </Button>
        </Alert>
      )}

      {/* TABLA */}
      <Typography variant="h5" gutterBottom>
        Tendederos en tiempo real
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#863e3bff" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Lluvia
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Posición
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Última act.
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tendederos.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <strong>{t.id}</strong>
                </TableCell>
                <TableCell>
                  <Chip
                    label={t.lluvia ? "Sí" : "No"}
                    color={t.lluvia ? "error" : "success"}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={t.posicion_tendedero || "—"}
                    color={
                      t.posicion_tendedero === "abierto" ? "success" : "default"
                    }
                  />
                </TableCell>
                <TableCell>{formatearFecha(t.ultima_actualizacion)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MENSAJE GLOBAL */}
      <Divider sx={{ my: 6 }} />
      <Typography variant="h5" gutterBottom>
        Enviar mensaje global a todos los usuarios
      </Typography>
      <TextField
        multiline
        rows={4}
        fullWidth
        value={mensajeGlobal}
        onChange={(e) => setMensajeGlobal(e.target.value)}
        placeholder="Ej: Mañana habrá mantenimiento del sistema a las 8:00 AM"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        size="large"
        startIcon={<Send />}
        onClick={enviarMensajeGlobal}
        sx={{ fontSize: "1.1rem", py: 1.5 }}
      >
        Enviar Mensaje Global
      </Button>
    </Box>
  );
}
