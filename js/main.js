import { searchCities, getWeather } from './api.js';
import { getSavedCities, saveCity, removeCity, isCitySaved } from './storage.js';
import * as UI from './ui.js';

let currentSelectedCity = null;

document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM principales
    const mainSearchInput = document.getElementById('city-search');
    const modalSearchInput = document.getElementById('modal-city-search');
    const btnSaveCity = document.getElementById('btn-save-location');
    const btnOpenModal = document.getElementById('btn-open-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const modalOverlay = document.getElementById('saved-locations-modal');

    // Inicializar estado guardado
    updateSavedCitiesUI();

    // Debounce function para la búsqueda
    let searchTimeout;
    const handleSearchInput = (inputEl, suggestionsId, loadingId) => {
        return (e) => {
            const query = e.target.value;
            clearTimeout(searchTimeout);

            if (query.trim().length < 2) {
                UI.hideSuggestions(suggestionsId);
                UI.toggleSearchLoading(false, loadingId);
                return;
            }

            UI.toggleSearchLoading(true, loadingId);

            searchTimeout = setTimeout(async () => {
                try {
                    const results = await searchCities(query);
                    UI.toggleSearchLoading(false, loadingId);
                    UI.renderSuggestions(results, suggestionsId, (city) => {
                        inputEl.value = city.name;
                        UI.hideSuggestions(suggestionsId);
                        handleCitySelection(city);
                        if (modalOverlay.classList.contains('hidden') === false) {
                            closeModal();
                        }
                    });
                } catch (error) {
                    UI.toggleSearchLoading(false, loadingId);
                    UI.showError('Error de red al buscar', suggestionsId.includes('modal') ? 'modal-search-error' : 'search-error');
                }
            }, 400); // 400ms debounce
        };
    };

    // Listeners de los Inputs
    mainSearchInput.addEventListener('input', handleSearchInput(mainSearchInput, 'search-suggestions', 'search-loading'));
    modalSearchInput.addEventListener('input', handleSearchInput(modalSearchInput, 'modal-search-suggestions', 'modal-search-loading'));

    // Listeners de los Formularios (para búsquedas con Enter o botón buscar)
    const handleFormSubmit = (inputEl, suggestionsId) => {
        return async (e) => {
            e.preventDefault();
            const query = inputEl.value;
            if (query.trim().length < 2) return;

            // Para dar feedback visual de validaciones
            UI.toggleSearchLoading(true, suggestionsId.includes('modal') ? 'modal-search-loading' : 'search-loading');

            try {
                const results = await searchCities(query);
                UI.toggleSearchLoading(false, suggestionsId.includes('modal') ? 'modal-search-loading' : 'search-loading');

                if (results.length > 0) {
                    const city = results[0];
                    inputEl.value = city.name;
                    UI.hideSuggestions(suggestionsId);
                    handleCitySelection(city);
                    if (!modalOverlay.classList.contains('hidden')) {
                        closeModal();
                    }
                } else {
                    UI.showError('Ciudad no encontrada', suggestionsId.includes('modal') ? 'modal-search-error' : 'search-error');
                }
            } catch (error) {
                UI.toggleSearchLoading(false, suggestionsId.includes('modal') ? 'modal-search-loading' : 'search-loading');
                UI.showError('Error de red al buscar', suggestionsId.includes('modal') ? 'modal-search-error' : 'search-error');
            }
        };
    };

    document.getElementById('main-search-form').addEventListener('submit', handleFormSubmit(mainSearchInput, 'search-suggestions'));
    document.getElementById('modal-search-form').addEventListener('submit', handleFormSubmit(modalSearchInput, 'modal-search-suggestions'));

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('.search-container')) {
            UI.hideSuggestions('search-suggestions');
        }
        if (!e.target.closest('.modal-search')) {
            UI.hideSuggestions('modal-search-suggestions');
        }
    });

    // Guardar / Remover ciudad desde el dashboard
    btnSaveCity.addEventListener('click', () => {
        if (!currentSelectedCity) return;

        const isSaved = isCitySaved(currentSelectedCity.id);
        if (isSaved) {
            removeCity(currentSelectedCity.id);
        } else {
            saveCity(currentSelectedCity);
        }

        // Re-render UI properties
        updateSavedCitiesUI();
        // Update dashboard save button visually
        UI.renderWeather(currentSelectedCity, window.currentWeatherData, isCitySaved(currentSelectedCity.id));
    });

    // Modal Events
    btnOpenModal.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Funciones Helper
    async function handleCitySelection(city) {
        currentSelectedCity = city;
        UI.showMainLoading();

        try {
            const weatherData = await getWeather(city.latitude, city.longitude);
            window.currentWeatherData = weatherData; // Store to avoid refetch if toggling save
            const isSaved = isCitySaved(city.id);
            UI.renderWeather(city, weatherData, isSaved);
        } catch (error) {
            UI.showInitialState();
            UI.showError('No se pudo cargar el clima para esta ciudad.');
        }
    }

    function updateSavedCitiesUI() {
        const cities = getSavedCities();
        UI.renderSavedCities(
            cities,
            (city) => {
                // Al seleccionar ciudad de guardados
                document.getElementById('city-search').value = city.name;
                closeModal();
                handleCitySelection(city);
            },
            (cityId) => {
                // Al remover ciudad de guardados
                removeCity(cityId);
                updateSavedCitiesUI();
                // Update dashboard save button if removing currently active city
                if (currentSelectedCity && currentSelectedCity.id === cityId) {
                    UI.renderWeather(currentSelectedCity, window.currentWeatherData, false);
                }
            }
        );
    }

    function openModal() {
        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        modalSearchInput.value = ''; // clean previous search
        UI.hideSuggestions('modal-search-suggestions');
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
});
