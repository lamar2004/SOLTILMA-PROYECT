import { Box, Typography, Container, Grid, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import DevicesIcon from "@mui/icons-material/Devices";
import StorageIcon from "@mui/icons-material/Storage";
import CloudIcon from "@mui/icons-material/Cloud";
import EngineeringIcon from "@mui/icons-material/Engineering";

export default function Home() {
  const navigate = useNavigate();

  // Las rutas de las imágenes que proporcionaste.
  // Nota: Si estas rutas son incorrectas, las imágenes no se cargarán.
  // Las rutas relativas a 'src/' pueden requerir importaciones específicas si usas Vite/Webpack.
  const CloudGIFL = "../images/Cloud.gif";
  const INFO_IMAGE_URL = "../images/soltilmaLogoSF.png";

  // Datos basados en las imágenes del proyecto Soltima
  const tecnologias = [
    {
      title: "Flutter",
      subtitle: "Desarrollo Móvil (App)",
      icon: <DevicesIcon sx={{ color: "primary.main", fontSize: 40 }} />,
      description:
        "Permite construir una única base de código para la aplicación iOS y Android, eficiente para el equipo.",
    },
    {
      title: "React",
      subtitle: "Web y Móvil (App)",
      icon: <CloudIcon sx={{ color: "primary.main", fontSize: 40 }} />,
      description:
        "Estándar para crear Interfaces de Usuario dinámicas para monitorear el estado del tendedero.",
    },
    {
      title: "Raspberry Pi / Arduino Uno",
      subtitle: "Plataforma",
      icon: <StorageIcon sx={{ color: "primary.main", fontSize: 40 }} />,
      description:
        "Hardware central para la lógica de control, lectura de sensores y la comunicación.",
    },
  ];

  return (
    // El Container centra el contenido y aplica paddings horizontales responsivos
    <Container component="main" sx={{ py: 6 }}>
      {/* 1. SECCIÓN PRINCIPAL (GIF/Imagen + Texto y Botones) */}
      <Box
        sx={{
          display: "flex",
          // Cambiamos a 'row' en escritorio para que la imagen y el texto estén lado a lado
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          textAlign: { xs: "center", md: "left" }, // Alineación centrada en móvil, a la izquierda en escritorio
          mb: 8,
          p: 4,
          // Fondo que imita el color de fondo de tu Hero Section
          background: "#4a6784",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Box sx={{ flex: 1, pr: { md: 4 } }}>
          {/* Texto "iniciar sesión" - Directamente del diseño */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" },
            }}
          >
            INICIAR SESION
          </Typography>
          <Typography
            variant="h5"
            paragraph
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Accede a Soltima. El clima bajo tu control.
          </Typography>

          {/* Botones */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 2,
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Iniciar
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/registro")}
              sx={{ borderColor: "white", color: "white" }}
            >
              Crear perfil
            </Button>
          </Box>
        </Box>

        {/* GIF / Imagen Principal (Mantenemos tamaño máximo) */}
        <Box
          component="img"
          src={CloudGIFL}
          alt="Sistema Soltima"
          sx={{
            width: { xs: "100%", md: 400 }, // El tamaño se reduce en móvil/tablet
            maxWidth: 400,
            height: "auto",
            mt: { xs: 4, md: 0 }, // Espacio superior en móvil
            flexShrink: 0,
          }}
        />
      </Box>

      {/* 2. PANELES CON INFO (Tecnologías) - Diseño Responsivo con Altura Uniforme */}
      <Typography
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: "medium" }}
      >
        Tecnologías del proyecto
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="stretch" // Clave: Asegura que todos los paneles tengan la misma altura
        sx={{ mb: 8 }}
      >
        {tecnologias.map((tech, index) => (
          <Grid
            item
            xs={12} // Móvil: Ocupa todo el ancho (1 por fila)
            sm={6} // Tableta: Ocupa medio ancho (2 por fila)
            md={4} // Escritorio: Ocupa un tercio (3 por fila)
            key={index}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: "100%", // Clave: Fuerza al Paper a llenar la altura del Grid item
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              {tech.icon}
              <Typography
                variant="h6"
                component="h3"
                sx={{ mt: 1, fontWeight: "bold" }}
              >
                {tech.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="primary.main"
                sx={{ mb: 1 }}
              >
                {tech.subtitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tech.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 3. BLOQUE FINAL (Texto + Imagen) - Diseño Responsivo Lado a Lado */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: "flex",
          // Imagen y texto apilados en móvil, lado a lado en escritorio
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            ¿Qué es Soltima?
          </Typography>
          <Typography variant="body1" paragraph>
            Soltima es un proyecto de ingeniería multidisciplinario que tiene
            como objetivo automatizar completamente el proceso de tender la ropa
            mediante el desarrollo de un tendedero inteligente.{" "}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <EngineeringIcon
              sx={{ verticalAlign: "middle", mr: 1 }}
              color="primary"
            />
            Tecnologías centrales: Hardware, lógica de control, lectura de
            sensores y comunicación.
          </Typography>
        </Box>

        {/* Imagen del bloque final */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", md: 350 },
            height: { xs: 200, md: 250 },
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
            // Asegura que la imagen tenga margen superior en móvil
            mt: { xs: 2, md: 0 },
          }}
        >
          <Box
            component="img"
            src={INFO_IMAGE_URL}
            alt="Fondo conceptual de Soltima"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
