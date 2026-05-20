document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const searchForm = document.getElementById('search-form');
  const cityInput = document.getElementById('city-input');
  const quickButtons = document.querySelectorAll('.btn-quick');
  const loader = document.getElementById('loader');
  const errorCard = document.getElementById('error-card');
  const errorMessage = document.getElementById('error-message');
  const weatherCard = document.getElementById('weather-card');
  
  const weatherCity = document.getElementById('weather-city');
  const weatherCondition = document.getElementById('weather-condition');
  const weatherIcon = document.getElementById('weather-icon');
  const weatherTemp = document.getElementById('weather-temp');
  const weatherHumidity = document.getElementById('weather-humidity');
  const weatherWind = document.getElementById('weather-wind');
  const weatherSource = document.getElementById('weather-source');

  // Trigger search on form submission
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
      getWeatherReport(city);
    }
  });

  // Trigger search on quick select buttons
  quickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const city = btn.getAttribute('data-city');
      cityInput.value = city;
      getWeatherReport(city);
    });
  });

  // Dynamic Theme Controller
  function updateWeatherTheme(condition) {
    const cond = condition.toLowerCase();
    
    // Clear existing themes
    document.body.className = '';
    
    if (cond.includes('sun') || cond.includes('clear') || cond.includes('warm')) {
      document.body.classList.add('theme-sunny');
    } else if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('storm') || cond.includes('shower')) {
      document.body.classList.add('theme-rain');
    } else if (cond.includes('snow') || cond.includes('ice') || cond.includes('freeze') || cond.includes('frost')) {
      document.body.classList.add('theme-snow');
    } else if (cond.includes('cloud') || cond.includes('overcast') || cond.includes('mist') || cond.includes('fog') || cond.includes('haze')) {
      document.body.classList.add('theme-cloudy');
    } else {
      document.body.classList.add('theme-default');
    }
  }

  // Fetch API Controller
  async function getWeatherReport(city) {
    // UI Loading State
    loader.classList.remove('hidden');
    errorCard.classList.add('hidden');
    weatherCard.classList.add('hidden');

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to retrieve weather records.');
      }

      // Populate UI Fields
      weatherCity.textContent = data.city;
      weatherCondition.textContent = data.condition;
      weatherTemp.textContent = data.temperature;
      weatherHumidity.textContent = `${data.humidity}%`;
      weatherWind.textContent = `${data.windSpeed} m/s`;
      weatherSource.textContent = data.source;

      // Update weather icon (uses official openweathermap pack)
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
      weatherIcon.alt = data.condition;

      // Switch global aesthetic color skin
      updateWeatherTheme(data.condition);

      // Transition to display state
      weatherCard.classList.remove('hidden');
    } catch (err) {
      console.error('[Client App] fetch error:', err);
      // Display failure notice
      errorMessage.textContent = err.message;
      errorCard.classList.remove('hidden');
    } finally {
      // Hide loader
      loader.classList.add('hidden');
    }
  }

  // Load a default city on startup for beautiful first-page presentation
  getWeatherReport('London');
});
