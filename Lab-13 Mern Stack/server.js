require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Helper: Map WMO Weather Interpretation Codes to readable descriptions and OpenWeather-like icons
function mapWmoCode(code) {
  if (code === 0) return { condition: 'Sunny', icon: '01d' };
  if ([1, 2, 3].includes(code)) return { condition: 'Partly Cloudy', icon: '02d' };
  if ([45, 48].includes(code)) return { condition: 'Foggy', icon: '50d' };
  if ([51, 53, 55, 56, 57].includes(code)) return { condition: 'Drizzle', icon: '09d' };
  if ([61, 63, 65, 66, 67].includes(code)) return { condition: 'Rain', icon: '10d' };
  if ([71, 73, 75, 77].includes(code)) return { condition: 'Snow', icon: '13d' };
  if ([80, 81, 82].includes(code)) return { condition: 'Rain Showers', icon: '09d' };
  if ([85, 86].includes(code)) return { condition: 'Snow Showers', icon: '13d' };
  if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', icon: '11d' };
  return { condition: 'Cloudy', icon: '03d' };
}

// Weather fetcher logic
async function fetchWeather(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // 1. Try OpenWeather API if a key is provided
  if (apiKey && apiKey.trim() !== '') {
    console.log(`[WeatherService] Attempting OpenWeather API for city: "${city}"`);
    try {
      const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const response = await axios.get(openWeatherUrl);
      const data = response.data;

      return {
        city: data.name,
        temperature: Math.round(data.main.temp * 10) / 10,
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        source: 'OpenWeather API'
      };
    } catch (error) {
      console.warn(`[WeatherService] OpenWeather API call failed: ${error.message}. Checking fallback options.`);
      // If it's a 404 (city not found), propagate it immediately as we shouldn't attempt fallback on invalid names
      if (error.response && error.response.status === 404) {
        throw new Error('City not found');
      }
      // If it's any other error (e.g. auth failed, rate limits), let's fall through to Open-Meteo!
    }
  }

  // 2. Fallback / Zero-Config: Open-Meteo API (Geocoding + Forecast)
  console.log(`[WeatherService] Running Open-Meteo driver for city: "${city}"`);
  
  // Geocoding request
  let geocodeRes;
  try {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`;
    geocodeRes = await axios.get(geocodeUrl);
  } catch (error) {
    throw new Error('Geocoding service unavailable');
  }

  const results = geocodeRes.data.results;
  if (!results || results.length === 0) {
    throw new Error('City not found');
  }

  const location = results[0];
  const { latitude, longitude, name: officialName, country } = location;

  // Weather forecast request
  try {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    const weatherRes = await axios.get(forecastUrl);
    const current = weatherRes.data.current;

    const weatherInfo = mapWmoCode(current.weather_code);

    return {
      city: country ? `${officialName}, ${country}` : officialName,
      temperature: Math.round(current.temperature_2m * 10) / 10,
      condition: weatherInfo.condition,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      icon: weatherInfo.icon,
      source: 'Open-Meteo (Zero-Config Fallback)'
    };
  } catch (error) {
    throw new Error('Weather forecast service unavailable');
  }
}

// REST Endpoints

// 1. GET /api/weather - Accepts city as query parameter (e.g., /api/weather?city=London)
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city || city.trim() === '') {
    return res.status(400).json({ error: 'City name parameter is required.' });
  }

  try {
    const weatherData = await fetchWeather(city.trim());
    return res.json(weatherData);
  } catch (error) {
    if (error.message === 'City not found') {
      return res.status(404).json({ error: `City not found: "${city}"` });
    }
    return res.status(500).json({ error: `Failed to fetch weather data: ${error.message}` });
  }
});

// 2. GET /api/weather/:city - Accepts city as route parameter (e.g., /api/weather/Paris)
app.get('/api/weather/:city', async (req, res) => {
  const city = req.params.city;
  if (!city || city.trim() === '') {
    return res.status(400).json({ error: 'City name parameter is required.' });
  }

  try {
    const weatherData = await fetchWeather(city.trim());
    return res.json(weatherData);
  } catch (error) {
    if (error.message === 'City not found') {
      return res.status(404).json({ error: `City not found: "${city}"` });
    }
    return res.status(500).json({ error: `Failed to fetch weather data: ${error.message}` });
  }
});

// Start express server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Weather Forecast API Server is running on port ${PORT}`);
  console.log(`Open in Browser: http://localhost:${PORT}`);
  console.log(`API endpoints available:`);
  console.log(`  - GET http://localhost:${PORT}/api/weather?city=London`);
  console.log(`  - GET http://localhost:${PORT}/api/weather/London`);
  console.log(`==================================================`);
});
