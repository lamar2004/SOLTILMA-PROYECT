import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// ARREGLAR EL ÍCONO DEL MARCADOR (esto es obligatorio en React)
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Clima() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PONÉ TU API KEY AQUÍ (¡SIN COMILLAS EXTRAS!)
  const API_KEY = "303827786b854b9112cc6bb0187a70a1"; // ← REEMPLAZÁ ESTO

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=es`
          );

          if (!response.ok) throw new Error("Error en la API");

          const data = await response.json();
          setWeather(data);
        } catch (err) {
          console.error(err);
          setError("No se pudo cargar el clima. Verificá tu API Key.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Permití la ubicación para ver el clima");
        setLoading(false);
      }
    );
  };

  return (
    <Box sx={{ py: 4, minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" color="white" gutterBottom>
          CLIMA ACTUAL
        </Typography>

        <Box sx={{ textAlign: "center", my: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<LocationOnIcon />}
            onClick={handleGetLocation}
            disabled={loading}
            sx={{
              backgroundColor: "#62afb5ff",
              fontSize: "1.3rem",
              py: 2,
              px: 6,
            }}
          >
            {loading ? (
              <CircularProgress size={28} color="inherit" />
            ) : (
              "Obtener clima"
            )}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {weather && (
          <Paper elevation={10} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {weather.name}, {weather.sys.country}
            </Typography>
            <Typography
              variant="h2"
              align="center"
              color="#d32f2f"
              fontWeight="bold"
            >
              {Math.round(weather.main.temp)}°C
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ textTransform: "capitalize", mb: 2 }}
            >
              {weather.weather[0].description}
            </Typography>
            <Typography align="center">
              Humedad: {weather.main.humidity}%
            </Typography>
            <Typography align="center">
              Viento: {weather.wind.speed} m/s
            </Typography>
          </Paper>
        )}

        <Box
          sx={{
            height: "500px",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: 10,
          }}
        >
          <MapContainer
            center={
              location ? [location.lat, location.lon] : [19.4326, -99.1332]
            }
            zoom={location ? 13 : 5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
            {location && (
              <Marker position={[location.lat, location.lon]}>
                <Popup>
                  {weather
                    ? `${weather.name}: ${Math.round(weather.main.temp)}°C`
                    : "Tu ubicación"}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Box>
      </Container>
    </Box>
  );
}
