import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase.js"; // Ajusta la ruta si es necesario

export default function DatosPersonales({ usuario }) {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: usuario?.email || "",
    id_esp: "",
  });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // Cargar datos actuales desde Firestore al entrar
  useEffect(() => {
    const cargarDatos = async () => {
      if (!usuario?.uid) return;

      try {
        const docRef = doc(db, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            nombre: data.nombre || "",
            apellidos: data.apellidos || "",
            email: data.email || usuario.email,
            id_esp: data.id_esp || "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    cargarDatos();
  }, [usuario]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!form.nombre.trim() || !form.id_esp.trim()) {
      setMensaje({
        tipo: "error",
        texto: "Nombre e ID ESP8266 son obligatorios",
      });
      return;
    }

    setCargando(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const docRef = doc(db, "usuarios", usuario.uid);
      await updateDoc(docRef, {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        id_esp: form.id_esp.trim().toUpperCase(),
      });

      // Actualizar localStorage para que el header se refresque
      const usuarioActualizado = {
        ...usuario,
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        id_esp: form.id_esp.trim().toUpperCase(),
      };
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      setMensaje({
        tipo: "success",
        texto: "¡Datos actualizados correctamente!",
      });
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: "Error al guardar. Intenta de nuevo.",
      });
    }
    setCargando(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4, backgroundColor: "#ffffffff" }}>
        <Typography variant="h4" align="center" gutterBottom color="#000000ff">
          Mis Datos Personales
        </Typography>

        {mensaje.texto && (
          <Alert severity={mensaje.tipo} sx={{ mb: 3 }}>
            {mensaje.texto}
          </Alert>
        )}

        <TextField
          label="Nombre"
          name="nombre"
          fullWidth
          margin="normal"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <TextField
          label="Apellidos"
          name="apellidos"
          fullWidth
          margin="normal"
          value={form.apellidos}
          onChange={handleChange}
        />

        <TextField
          label="Correo electrónico"
          fullWidth
          margin="normal"
          value={form.email}
          disabled
          helperText="El correo no se puede cambiar"
        />

        <TextField
          label="ID de mi ESP8266 (tendedero)"
          name="id_esp"
          fullWidth
          margin="normal"
          value={form.id_esp}
          onChange={handleChange}
          required
          helperText="Ejemplo: ESP-001A, CASA-JAVIER, etc. Debe coincidir exactamente con el del módulo físico"
          sx={{ mt: 3 }}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleGuardar}
          disabled={cargando}
          sx={{ mt: 4, py: 2, fontSize: "1.2rem" }}
        >
          {cargando ? <CircularProgress size={28} /> : "Guardar Cambios"}
        </Button>
      </Paper>
    </Box>
  );
}
