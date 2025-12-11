import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  // --- Nuevas importaciones para el diálogo ---
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig/firebase.js";
import { useState } from "react";

export default function Header({ usuario, onLogout }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // Nuevo estado para controlar el diálogo de confirmación
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // --- Manejo del Diálogo ---
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  // --- Nueva función para ejecutar el Logout ---
  const executeLogout = async () => {
    // 1. Cerrar sesión en Firebase
    await signOut(auth);

    // 2. Limpiar estado local en App.jsx
    if (onLogout) onLogout();

    // 3. Redirigir a la página principal (/) como solicitaste
    navigate("/");
  };

  const handleLogout = () => {
    handleCloseConfirm(); // Cierra el diálogo de confirmación
    executeLogout();
  };

  const isAdmin = usuario?.rol === "ADMIN";

  return (
    <AppBar position="static" sx={{ background: "#c2ab90ff", boxShadow: 4 }}>
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, px: { xs: 2, sm: 3 } }}>
        {/* Logo + Nombre (Se mantiene igual) */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <SchoolIcon sx={{ fontSize: { xs: 32, sm: 40 }, mr: 1 }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.4rem", sm: "1.8rem" },
              letterSpacing: 1,
            }}
          >
            SOLTILMA
          </Typography>
        </Box>

        {/* Menú en PC/Tablet (Se mantiene igual) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 4,
            alignItems: "center",
          }}
        >
          {/* ... Botones de navegación (Admin/Usuario) ... */}
          {isAdmin ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/datos"
                sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
              >
                USUARIOS
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/admin"
                sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
              >
                ADMIN PANEL
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/analisis"
                sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
              >
                ANÁLISIS
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/datos-personales"
                sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
              >
                MIS DATOS
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/clima"
                sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
              >
                CLIMA
              </Button>
            </>
          )}
        </Box>

        {/* Usuario + Cerrar sesión (PC) --- Modificado el onClick --- */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
            ml: 4,
          }}
        >
          <PersonIcon sx={{ fontSize: 28 }} />
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
          >
            {usuario?.nombre || "Usuario"} ({usuario?.rol})
          </Typography>
          <Button
            color="inherit"
            // Llamamos al diálogo de confirmación en lugar de cerrar sesión directamente
            onClick={handleOpenConfirm}
            startIcon={<ExitToAppIcon />}
            variant="outlined"
            sx={{ borderColor: "white", ml: 2, fontWeight: "bold" }}
          >
            Cerrar sesión
          </Button>
        </Box>

        {/* Menú hamburguesa + usuario (MÓVIL) --- Modificado el onClick --- */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
            {usuario?.nombre?.split(" ")[0]} ({usuario?.rol})
          </Typography>
          <IconButton color="inherit" onClick={handleMenu}>
            <MenuIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{ sx: { width: 220, mt: 1 } }}
          >
            {/* ... Items de navegación (Admin/Usuario) ... */}
            {isAdmin ? (
              <>
                <MenuItem component={Link} to="/datos" onClick={handleClose}>
                  Usuarios
                </MenuItem>
                <MenuItem component={Link} to="/admin" onClick={handleClose}>
                  Admin Panel
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem component={Link} to="/analisis" onClick={handleClose}>
                  Análisis
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/datos-personales"
                  onClick={handleClose}
                >
                  Mis Datos
                </MenuItem>
                <MenuItem component={Link} to="/clima" onClick={handleClose}>
                  Clima
                </MenuItem>
              </>
            )}
            <MenuItem
              onClick={() => {
                handleClose();
                handleOpenConfirm(); // Abrir diálogo de confirmación desde el menú
              }}
            >
              <ExitToAppIcon sx={{ mr: 1 }} /> Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>

        {/* --- DIÁLOGO DE CONFIRMACIÓN (NUEVO) --- */}
        <Dialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          aria-labelledby="confirm-logout-dialog-title"
          aria-describedby="confirm-logout-dialog-description"
        >
          <DialogTitle id="confirm-logout-dialog-title">
            {"Confirmación de Cierre de Sesión"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-logout-dialog-description">
              ¿Estás seguro que deseas cerrar la sesión actual? Serás redirigido
              a la página principal.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={handleLogout}
              color="primary"
              autoFocus
              variant="contained"
            >
              Cerrar Sesión
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}
