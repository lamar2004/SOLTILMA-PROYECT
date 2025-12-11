import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase.js";

export default function Datos({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [mensaje, setMensaje] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isAdmin = usuario?.rol === "ADMIN";

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(lista);
    });
    return () => unsub();
  }, []);

  const iniciarEdicion = (user) => {
    if (!isAdmin) return;
    setEditingId(user.id);
    setEditForm({
      nombre: user.nombre || "",
      apellidos: user.apellidos || "",
      email: user.email || "",
      rol: user.rol || "USUARIO",
      id_esp: user.id_esp || "",
    });
  };

  const guardarEdicion = async () => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "usuarios", editingId), {
        nombre: editForm.nombre.trim(),
        apellidos: editForm.apellidos.trim(),
        email: editForm.email.trim(),
        rol: editForm.rol,
        id_esp: editForm.id_esp.trim().toUpperCase(),
      });
      setMensaje("Usuario actualizado correctamente");
      setEditingId(null);
    } catch (err) {
      setMensaje("Error al guardar");
    }
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setEditForm({});
  };

  const eliminarUsuario = async (id) => {
    if (!isAdmin || !window.confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteDoc(doc(db, "usuarios", id));
      setMensaje("Usuario eliminado");
    } catch (err) {
      setMensaje("Error al eliminar");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        color="#f6f6f6ff"
        sx={{
          fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
          fontWeight: "bold",
        }}
      >
        Gestión de Usuarios
      </Typography>

      {mensaje && (
        <Alert
          severity={
            mensaje.includes("correctamente") || mensaje.includes("eliminado")
              ? "success"
              : "error"
          }
          sx={{ mb: 3 }}
        >
          {mensaje}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        elevation={6}
        sx={{ borderRadius: 3, overflowX: "auto" }}
      >
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#aba183ff" }}>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                Nombre
              </TableCell>
              {!isMobile && (
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Apellidos
                </TableCell>
              )}
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Correo
              </TableCell>
              {!isTablet && (
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  ID ESP8266
                </TableCell>
              )}
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Rol
              </TableCell>
              {isAdmin && (
                <TableCell
                  sx={{ color: "white", fontWeight: "bold" }}
                  align="center"
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow
                key={u.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* Nombre + Apellidos (en móvil se juntan) */}
                <TableCell>
                  {editingId === u.id ? (
                    <TextField
                      size="small"
                      value={editForm.nombre}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nombre: e.target.value })
                      }
                      fullWidth
                    />
                  ) : (
                    <Box>
                      <strong>{u.nombre}</strong>
                      {isMobile && <br />}
                      {isMobile && (
                        <span style={{ color: "#666", fontSize: "0.9rem" }}>
                          {u.apellidos}
                        </span>
                      )}
                    </Box>
                  )}
                </TableCell>

                {/* Apellidos (solo en tablet/PC) */}
                {!isMobile && (
                  <TableCell>
                    {editingId === u.id ? (
                      <TextField
                        size="small"
                        value={editForm.apellidos}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            apellidos: e.target.value,
                          })
                        }
                      />
                    ) : (
                      u.apellidos
                    )}
                  </TableCell>
                )}

                {/* Correo */}
                <TableCell sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
                  {u.email}
                </TableCell>

                {/* ID ESP (solo en tablet/PC) */}
                {!isTablet && (
                  <TableCell>
                    {editingId === u.id ? (
                      <TextField
                        size="small"
                        value={editForm.id_esp}
                        onChange={(e) =>
                          setEditForm({ ...editForm, id_esp: e.target.value })
                        }
                      />
                    ) : (
                      <strong>{u.id_esp || "Sin asignar"}</strong>
                    )}
                  </TableCell>
                )}

                {/* Rol */}
                <TableCell>
                  {editingId === u.id ? (
                    <FormControl size="small" fullWidth>
                      <Select
                        value={editForm.rol}
                        onChange={(e) =>
                          setEditForm({ ...editForm, rol: e.target.value })
                        }
                      >
                        <MenuItem value="USUARIO">
                          <PersonIcon fontSize="small" sx={{ mr: 1 }} /> USUARIO
                        </MenuItem>
                        <MenuItem value="ADMIN">
                          <AdminPanelSettingsIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "orange" }}
                          />{" "}
                          ADMIN
                        </MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Chip
                      label={u.rol}
                      color={u.rol === "ADMIN" ? "error" : "success"}
                      size="small"
                      icon={
                        u.rol === "ADMIN" ? (
                          <AdminPanelSettingsIcon />
                        ) : (
                          <PersonIcon />
                        )
                      }
                    />
                  )}
                </TableCell>

                {/* Acciones */}
                {isAdmin && (
                  <TableCell align="center">
                    {editingId === u.id ? (
                      <>
                        <IconButton
                          color="success"
                          onClick={guardarEdicion}
                          size={isMobile ? "small" : "medium"}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          color="warning"
                          onClick={cancelarEdicion}
                          size={isMobile ? "small" : "medium"}
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => iniciarEdicion(u)}
                          size={isMobile ? "small" : "medium"}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => eliminarUsuario(u.id)}
                          size={isMobile ? "small" : "medium"}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
