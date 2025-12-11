export async function getWeatherByCoords(lat, lon) {
  const apiKey = "303827786b854b9112cc6bb0187a70a1";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    return null;
  }
}
