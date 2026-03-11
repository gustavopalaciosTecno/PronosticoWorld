const STORAGE_KEY = 'weather_saved_cities';

/**
 * Obtiene las ciudades guardadas desde LocalStorage.
 * @returns {Array} Un array con objetos ciudad.
 */
export function getSavedCities() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Guarda una nueva ciudad en LocalStorage si no existe.
 * @param {Object} city - Objeto ciudad.
 * @returns {boolean} True si se guardó, false si ya existía.
 */
export function saveCity(city) {
    const cities = getSavedCities();
    // Evitar duplicados por id de open-meteo o lat/lon (aprox)
    const exists = cities.some(c => c.id === city.id);
    if (!exists) {
        cities.push(city);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
        return true;
    }
    return false;
}

/**
 * Elimina una ciudad basándose en su id.
 * @param {number|string} cityId - ID de la ciudad a eliminar.
 */
export function removeCity(cityId) {
    const cities = getSavedCities();
    const filtered = cities.filter(c => c.id !== cityId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Comprueba si una ciudad ya está guardada.
 * @param {number|string} cityId - ID de la ciudad.
 * @returns {boolean}
 */
export function isCitySaved(cityId) {
    const cities = getSavedCities();
    return cities.some(c => c.id === cityId);
}
