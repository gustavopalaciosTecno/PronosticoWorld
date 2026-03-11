/**
 * Mapeo de códigos WMO Weather a íconos de Material Symbols y descripciones.
 */
export const WEATHER_MAPPING = {
    0: { icon: 'wb_sunny', desc: 'Despejado' },
    1: { icon: 'partly_cloudy_day', desc: 'Principalmente despejado' },
    2: { icon: 'partly_cloudy_day', desc: 'Parcialmente nublado' },
    3: { icon: 'cloud', desc: 'Nublado' },
    45: { icon: 'foggy', desc: 'Niebla' },
    48: { icon: 'foggy', desc: 'Niebla escarcha' },
    51: { icon: 'rainy', desc: 'Llovizna ligera' },
    53: { icon: 'rainy', desc: 'Llovizna moderada' },
    55: { icon: 'rainy', desc: 'Llovizna densa' },
    56: { icon: 'rainy', desc: 'Llovizna gélida ligera' },
    57: { icon: 'rainy', desc: 'Llovizna gélida densa' },
    61: { icon: 'rainy', desc: 'Lluvia ligera' },
    63: { icon: 'rainy', desc: 'Lluvia moderada' },
    65: { icon: 'rainy', desc: 'Lluvia fuerte' },
    66: { icon: 'rainy', desc: 'Lluvia helada ligera' },
    67: { icon: 'rainy', desc: 'Lluvia helada fuerte' },
    71: { icon: 'ac_unit', desc: 'Nieve ligera' },
    73: { icon: 'ac_unit', desc: 'Nieve moderada' },
    75: { icon: 'ac_unit', desc: 'Nieve fuerte' },
    77: { icon: 'ac_unit', desc: 'Granizo' },
    80: { icon: 'rainy', desc: 'Chubascos ligeros' },
    81: { icon: 'rainy', desc: 'Chubascos moderados' },
    82: { icon: 'rainy', desc: 'Chubascos violentos' },
    85: { icon: 'ac_unit', desc: 'Chubascos de nieve ligeros' },
    86: { icon: 'ac_unit', desc: 'Chubascos de nieve fuertes' },
    95: { icon: 'thunderstorm', desc: 'Tormenta' },
    96: { icon: 'thunderstorm', desc: 'Tormenta con granizo ligero' },
    99: { icon: 'thunderstorm', desc: 'Tormenta con granizo fuerte' }
};

function getWeatherInfo(code) {
    return WEATHER_MAPPING[code] || { icon: 'cloud', desc: 'Desconocido' };
}

export function showInitialState() {
    document.getElementById('initial-state').classList.remove('hidden');
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('weather-content').classList.add('hidden');
}

export function showMainLoading() {
    document.getElementById('initial-state').classList.add('hidden');
    document.getElementById('loading-state').classList.remove('hidden');
    document.getElementById('weather-content').classList.add('hidden');
}

export function showWeatherContent() {
    document.getElementById('initial-state').classList.add('hidden');
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('weather-content').classList.remove('hidden');
}

export function renderSuggestions(cities, containerId, onSelectCallback) {
    const list = document.getElementById(containerId);
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    if (cities.length === 0) {
        list.classList.add('hidden');
        return;
    }

    cities.forEach(city => {
        const li = document.createElement('li');
        li.className = 'suggestion-item';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'suggestion-name';
        nameDiv.textContent = city.name;

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'suggestion-details';
        const subdivision = city.admin1 ? `${city.admin1}, ` : '';
        detailsDiv.textContent = `${subdivision}${city.country}`;

        li.appendChild(nameDiv);
        li.appendChild(detailsDiv);

        li.addEventListener('pointerdown', (e) => {
            e.preventDefault(); // Prevent input from losing focus if needed
            list.classList.add('hidden');
            onSelectCallback(city);
        });

        list.appendChild(li);
    });

    list.classList.remove('hidden');
}

export function hideSuggestions(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.classList.add('hidden');
    }
}

export function toggleSearchLoading(isLoading, elementId = 'search-loading') {
    const loader = document.getElementById(elementId);
    if (isLoading) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

export function showError(message, elementId = 'search-error') {
    const errorEl = document.getElementById(elementId);
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    setTimeout(() => {
        errorEl.classList.add('hidden');
    }, 3000);
}

export function renderWeather(city, weatherData, isSaved) {
    const current = weatherData.current;
    if (!current) return;

    // Dates and Times
    const dateOpts = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = new Intl.DateTimeFormat('es-ES', dateOpts).format(new Date());

    // Update DOM
    document.getElementById('current-city-name').textContent = `${city.name}, ${city.country}`;
    document.getElementById('current-date').textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    document.getElementById('current-temp').textContent = `${Math.round(current.temperature_2m)}°`;
    document.getElementById('current-feels-like').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('current-humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('current-wind').textContent = `${current.wind_speed_10m} km/h`;

    const wInfo = getWeatherInfo(current.weather_code);
    document.getElementById('current-desc').textContent = wInfo.desc;
    document.getElementById('current-weather-icon').textContent = wInfo.icon;
    document.getElementById('current-weather-bg-icon').textContent = wInfo.icon;

    // Update Save button state
    const btnSave = document.getElementById('btn-save-location');
    if (isSaved) {
        btnSave.classList.add('saved');
        btnSave.querySelector('span').textContent = 'bookmark_added';
        btnSave.title = 'Ubicación guardada';
    } else {
        btnSave.classList.remove('saved');
        btnSave.querySelector('span').textContent = 'bookmark_add';
        btnSave.title = 'Guardar ubicación';
    }

    renderHourlyForecast(weatherData.hourly);
    showWeatherContent();
}

function renderHourlyForecast(hourly) {
    const grid = document.getElementById('hourly-grid');
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

    if (!hourly || !hourly.time) return;

    // Find current time index
    const now = new Date();
    // API returns times in ISO format (e.g. "2023-10-14T12:00")
    // We get the next 24 hours starting from current hour
    const nowLocalTime = new Date().getTime();

    // Filtro para mostrar unas 12 o 24 horas a partir de ahora, sin duplicados
    let itemsAdded = 0;

    for (let i = 0; i < hourly.time.length; i++) {
        const hTime = new Date(hourly.time[i]);
        if (hTime.getTime() >= nowLocalTime - (60 * 60 * 1000) && itemsAdded < 24) {

            const isNow = itemsAdded === 0;
            const wInfo = getWeatherInfo(hourly.weather_code[i]);

            const card = document.createElement('div');
            card.className = `hourly-card ${isNow ? 'active' : ''}`;

            const timeSpan = document.createElement('span');
            timeSpan.className = 'time';
            // Extract hour and minutes HH:MM
            timeSpan.textContent = isNow ? 'Ahora' : `${hTime.getHours().toString().padStart(2, '0')}:00`;

            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-symbols-outlined';
            iconSpan.textContent = wInfo.icon;

            const tempSpan = document.createElement('span');
            tempSpan.className = 'temp';
            tempSpan.textContent = `${Math.round(hourly.temperature_2m[i])}°`;

            const descSpan = document.createElement('span');
            descSpan.className = 'desc hidden'; // optional, can show/hide
            descSpan.textContent = wInfo.desc;

            card.appendChild(timeSpan);
            card.appendChild(iconSpan);
            card.appendChild(tempSpan);
            // card.appendChild(descSpan);

            grid.appendChild(card);
            itemsAdded++;
        }
    }
}

export function renderSavedCities(cities, onSelect, onRemove) {
    const list = document.getElementById('saved-locations-list');
    const emptyState = document.getElementById('empty-saved-state');
    const badge = document.getElementById('saved-count');

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    badge.textContent = cities.length;
    if (cities.length > 0) {
        badge.classList.remove('hidden');
        emptyState.classList.add('hidden');
    } else {
        badge.classList.add('hidden');
        emptyState.classList.remove('hidden');
    }

    cities.forEach(city => {
        const card = document.createElement('div');
        card.className = 'saved-city-card';

        const mainDiv = document.createElement('div');
        mainDiv.className = 'city-main';

        const iconDiv = document.createElement('div');
        iconDiv.className = 'city-icon';
        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined';
        iconSpan.textContent = 'location_city';
        iconDiv.appendChild(iconSpan);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'city-info';

        const nameP = document.createElement('p');
        nameP.className = 'city-name';
        nameP.textContent = city.name;

        const countryP = document.createElement('p');
        countryP.className = 'country-name';
        countryP.textContent = `${city.admin1 ? city.admin1 + ', ' : ''}${city.country || ''}`;

        infoDiv.appendChild(nameP);
        infoDiv.appendChild(countryP);

        mainDiv.appendChild(iconDiv);
        mainDiv.appendChild(infoDiv);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'city-actions';

        const cityTempInfo = document.createElement('div');
        cityTempInfo.className = 'city-temp-info';
        
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.title = 'Eliminar ciudad';
        const delIcon = document.createElement('span');
        delIcon.className = 'material-symbols-outlined';
        delIcon.textContent = 'delete';
        btnDelete.appendChild(delIcon);

        btnDelete.addEventListener('click', (e) => {
            e.stopPropagation();
            onRemove(city.id);
        });

        // Current weather info implementation
        const tempSpan = document.createElement('span');
        tempSpan.className = 'city-temp';
        tempSpan.textContent = '--°';
        
        const descSpan = document.createElement('span');
        descSpan.className = 'city-weather-desc';
        descSpan.textContent = 'Cargando...';

        cityTempInfo.appendChild(tempSpan);
        cityTempInfo.appendChild(descSpan);

        // Fetch small data immediately
        import('./api.js').then(({ getWeather }) => {
            getWeather(city.latitude, city.longitude)
                .then(data => {
                    if(data.current) {
                        tempSpan.textContent = `${Math.round(data.current.temperature_2m)}°`;
                        descSpan.textContent = getWeatherInfo(data.current.weather_code).desc;
                        iconSpan.textContent = getWeatherInfo(data.current.weather_code).icon;
                    }
                })
                .catch(err => {
                    descSpan.textContent = 'Sin datos';
                });
        });

        actionsDiv.appendChild(cityTempInfo);
        actionsDiv.appendChild(btnDelete);

        card.appendChild(mainDiv);
        card.appendChild(actionsDiv);

        card.addEventListener('click', () => {
            onSelect(city);
        });

        list.appendChild(card);
    });
}
