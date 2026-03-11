const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Busca ciudades utilizando la API de Geocoding de Open-Meteo.
 * @param {string} query - Nombre de la ciudad a buscar.
 * @returns {Promise<Array>} Lista de resultados de ciudades.
 */
export async function searchCities(query) {
    if (!query || query.trim().length < 2) return [];

    try {
        const response = await fetch(`${GEOCODING_BASE_URL}?name=${encodeURIComponent(query)}&count=10&language=es&format=json`);
        if (!response.ok) throw new Error('Error al buscar ciudades');
        const data = await response.json();
        
        if (!data.results) return [];

        // Sort by population to always show the most important/real city first
        // (e.g. Madrid, Spain vs Madrid, Colombia)
        const sortedResults = data.results.sort((a, b) => {
            const popA = a.population || 0;
            const popB = b.population || 0;
            return popB - popA;
        });

        // Solo devolver los 5 mejores resultados después de ordenar por relevancia
        return sortedResults.slice(0, 5);
    } catch (error) {
        console.error('Error in searchCities:', error);
        throw error;
    }
}

/**
 * Obtiene el clima actual y pronóstico horario para las coordenadas dadas.
 * @param {number} lat - Latitud.
 * @param {number} lon - Longitud.
 * @returns {Promise<Object>} Datos del clima de Open-Meteo.
 */
export async function getWeather(lat, lon) {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
            hourly: 'temperature_2m,weather_code',
            timezone: 'auto',
            forecast_days: 2
        });
        
        const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
        if (!response.ok) throw new Error('Error al obtener el clima');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in getWeather:', error);
        throw error;
    }
}
