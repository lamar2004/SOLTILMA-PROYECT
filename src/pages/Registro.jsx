import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig/firebase.js";

export default function Registro({ onBack, onRegistroExitoso }) {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    password: "",
    id_esp: "", // ← NUEVO CAMPO
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    const { nombre, apellidos, correo, password, id_esp } = form;

    if (
      !nombre.trim() ||
      !apellidos.trim() ||
      !correo.trim() ||
      !password.trim() ||
      !id_esp.trim()
    ) {
      setMensaje(
        "Todos los campos son obligatorios, incluido el ID del ESP8266."
      );
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      // 1. Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        correo.trim(),
        password
      );
      const user = userCredential.user;

      // 2. Guardar en Firestore con el ID_ESP
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        email: correo.trim(),
        id_esp: id_esp.trim().toUpperCase(), // Guardamos en mayúsculas para evitar duplicados
        rol: "USUARIO",
        fechaRegistro: new Date().toISOString(),
      });

      setMensaje("¡Registro exitoso! Tu tendedero ya está vinculado.");

      const usuarioLogueado = {
        uid: user.uid,
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        email: correo.trim(),
        id_esp: id_esp.trim().toUpperCase(),
        rol: "USUARIO",
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioLogueado));

      if (onRegistroExitoso) {
        setTimeout(() => onRegistroExitoso(usuarioLogueado), 1000);
      }
    } catch (error) {
      setLoading(false);
      let msg = "Error desconocido";
      if (error.code === "auth/email-already-in-use")
        msg = "Este correo ya está registrado.";
      else if (error.code === "auth/weak-password")
        msg = "La contraseña debe tener al menos 6 caracteres.";
      else if (error.code === "auth/invalid-email") msg = "Correo inválido.";
      setMensaje(msg);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
        color: "white",
      }}
    >
      <Box
        sx={{ background: "#7ba0aaff", p: 4, borderRadius: 3, boxShadow: 3 }}
      >
        <SchoolIcon
          sx={{ display: "block", mx: "auto", mb: 2, fontSize: 60 }}
        />
        <Typography variant="h4" textAlign="center" gutterBottom>
          Registro de Usuario
        </Typography>

        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          disabled={loading}
        />

        <TextField
          label="Apellidos"
          fullWidth
          margin="normal"
          value={form.apellidos}
          onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
          disabled={loading}
        />

        <TextField
          label="Correo Electrónico"
          type="email"
          fullWidth
          margin="normal"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          disabled={loading}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          disabled={loading}
          helperText="Mínimo 6 caracteres"
        />

        <TextField
          label="ID del ESP8266 (físico en tu módulo)"
          fullWidth
          margin="normal"
          value={form.id_esp}
          onChange={(e) => setForm({ ...form, id_esp: e.target.value })}
          disabled={loading}
          helperText="Ejemplo: ESP-001A, CASA1, etc. Único por tendedero"
          sx={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegistro}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Registrarse"}
        </Button>

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1, color: "white" }}
          onClick={() => (window.location.href = "/")}
          disabled={loading}
        >
          Volver Pagina de Inicio
        </Button>

        {mensaje && (
          <Alert
            severity={mensaje.includes("exitoso") ? "success" : "error"}
            sx={{ mt: 2 }}
          >
            {mensaje}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
