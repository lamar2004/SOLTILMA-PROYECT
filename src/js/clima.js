export async function getWeatherByCoords(lat, lon) {
  const apiKey = "";
  const url = ``;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    return null;
  }
}
