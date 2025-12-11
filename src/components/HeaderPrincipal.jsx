import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { useNavigate } from "react-router-dom";

export default function HeaderPrincipal({ usuario, onLogout }) {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (usuario) {
      // Si el usuario está logueado, llama a la función de logout
      onLogout();
      navigate("/login"); // Redirige a login después de cerrar sesión
    } else {
      // Si el usuario no está logueado, navega a la página de login
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mb: 2,
        paddingTop: 2,
        px: { xs: 2, sm: 3 },
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "black",
          boxShadow: 3,
          borderRadius: 6,
          width: "1100px",
          width: { xs: "95%", sm: "90%", lg: "1100px" },
        }}
      >
        <Toolbar>
          {/* Logo Soltima */}
          <FlashOnIcon sx={{ color: "yellow", mr: 1 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "white",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Soltima
          </Typography>

          {/* Botón de Autenticación */}
          <Button
            color="inherit"
            variant="contained"
            onClick={handleAuthClick}
            sx={{
              backgroundColor: "white",
              color: "black",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
              p: { xs: "6px 8px", sm: "8px 16px" },
            }}
          >
            {usuario ? "Cerrar sesión" : "Inicio de sesión"}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
