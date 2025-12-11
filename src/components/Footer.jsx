import { Box, Typography, Grid, Link } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/X"; // El icono de Twitter ahora es X

export default function Footer() {
  // Define los enlaces y contenido del footer
  const footerItems = [
    {
      title: "Features",
      links: ["Core features", "Pro experience", "Integrations"],
    },
    {
      title: "Learn more",
      links: ["Blog", "Case studies", "Customer stories", "Best practices"],
    },
    {
      title: "Support",
      links: ["Contact", "Support", "Legal"],
    },
  ];

  // Define los enlaces reales a las redes sociales
  const socialLinks = {
    instagram: "https://www.instagram.com/tu_usuario_soltima",
    linkedin: "https://www.linkedin.com/company/tu_empresa_soltima",
    twitter: "https://twitter.com/tu_usuario_soltima",
  };

  // El color de fondo es el mismo azul grisáceo que se ve en tu Hero/Header
  const FOOTER_BACKGROUND_COLOR = "#46607e";

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: FOOTER_BACKGROUND_COLOR,
        color: "white",
        py: { xs: 6, md: 8 }, // Padding vertical responsivo
        mt: 4, // Margen superior para separarlo del contenido del Home
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 4 }}>
        <Grid container spacing={4}>
          {/* Columna 1: Soltima Info y Redes Sociales */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 0.5, letterSpacing: 1 }}
            >
              Soltima
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Automatiza el sol.
            </Typography>

            {/* Redes Sociales (Funcionales) */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              {/* Instagram */}
              <Link
                href={"https://www.instagram.com/acx.experience/"}
                target="_blank"
                rel="noopener"
                color="inherit"
                sx={{ display: "flex" }}
              >
                <InstagramIcon
                  sx={{ fontSize: 24, "&:hover": { color: "#e4405f" } }}
                />
              </Link>
              {/* LinkedIn */}
              <Link
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener"
                color="inherit"
                sx={{ display: "flex" }}
              >
                <LinkedInIcon
                  sx={{ fontSize: 24, "&:hover": { color: "#0077b5" } }}
                />
              </Link>
              {/* Twitter/X */}
              <Link
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener"
                color="inherit"
                sx={{ display: "flex" }}
              >
                <TwitterIcon
                  sx={{ fontSize: 22, "&:hover": { color: "white" } }}
                />
              </Link>
            </Box>
          </Grid>

          {/* Columnas de Enlaces (Features, Learn More, Support) */}
          <Grid
            item
            container
            xs={12}
            md={8}
            spacing={4}
            sx={{ mt: { xs: 3, md: 0 } }}
          >
            {footerItems.map((col, colIndex) => (
              <Grid item xs={4} sm={4} key={colIndex}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1.5 }}
                >
                  {col.title}
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  {col.links.map((linkText, linkIndex) => (
                    <Link
                      href="#" // Puedes poner aquí rutas de tu App o URLs externas
                      key={linkIndex}
                      variant="body2"
                      color="inherit"
                      underline="none"
                      sx={{
                        opacity: 0.8,
                        transition: "opacity 0.2s",
                        "&:hover": {
                          opacity: 1,
                          color: "yellow", // Resaltar al pasar el ratón
                        },
                      }}
                    >
                      {linkText}
                    </Link>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
