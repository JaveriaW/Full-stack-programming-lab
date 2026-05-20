# AeroCast | Premium Weather Forecast REST API & Dashboard

AeroCast is a sleek, modern, and robust Weather Forecast REST API built from scratch using **Node.js** and **Express.js**. It features a dual-service backend integration driver that dynamically switches between the official **OpenWeatherMap API** and a zero-config, highly-accurate **Open-Meteo API fallback** (so the project works perfectly out-of-the-box with zero setup). 

Complementing the backend is an interactive, stunning glassmorphic client-side dashboard that showcases premium aesthetics, micro-animations, fluid layout grids, and weather-themed ambient glow animations.

---

## 🌟 Key Features

* **Dual Weather Drivers:**
  * **OpenWeather Driver:** Used immediately if a valid `OPENWEATHER_API_KEY` is present in the `.env` configuration.
  * **Open-Meteo Fallback:** Active by default. Resolves any city name dynamically using Open-Meteo's geocoding engine and fetches real-time coordinates, ensuring the API functions globally out-of-the-box.
* **Dual Endpoint Styles:** Fully compliant REST endpoint supporting both Query params (`?city=x`) and Route params (`/x`).
* **Robust Error Handling:** Properly catches and formats error responses (e.g. invalid city names, API rate limits, server offline) returning standard HTTP statuses (`400`, `404`, `500`) and JSON errors.
* **Premium Client Dashboard:** Built inside the static `public/` folder utilizing HSL tailoring, glassmorphic elements, loading states, and weather-sensitive theme skin shifting (sunny, rainy, cloudy, snowy, default).
* **Interactive Quick-Selects:** Pre-configured buttons for global hubs (London, New York, Tokyo, Sydney, Cairo) to enable instantaneous testing with one click.

---

## 📂 Project Architecture

```
weather-forecast-api/
├── public/                 # Static Frontend Dashboard
│   ├── index.html          # Semantic HTML5 Layout & Structure
│   ├── style.css           # Premium CSS Variables, Animations, Glassmorphic Grid
│   └── app.js              # Client Fetch Operations, Dynamic Themes, UI State Manager
├── .env                    # Configured environment variables (ignored by git)
├── .env.example            # Environment variables template
├── package.json            # Node.js manifest with standard run scripts
└── server.js               # Core Express.js application, dual drivers & API routes
```

---

## 🚀 Installation & Setup

Follow these simple steps to run the application on your computer:

### 1. Navigate to Project Folder
```bash
cd weather-forecast-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Configuration (Optional)
If you wish to test the OpenWeatherMap API, open the `.env` file and insert your API key:
```env
PORT=5000
OPENWEATHER_API_KEY=your_openweather_api_key_here
```
*Note: If left blank, the app will gracefully run using the live Open-Meteo fallback driver.*

### 4. Start the Application
To run the server in production mode:
```bash
npm start
```

For developer automatic-reloading (using `nodemon`):
```bash
npm run dev
```

*If you encounter a PowerShell script execution error on Windows, bypass it by running:*
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

---

## 📡 REST API Documentation

### 1. Query Parameter Format
* **Endpoint:** `/api/weather`
* **Method:** `GET`
* **Parameters:** `city` (string, required)
* **Example:** `http://localhost:5000/api/weather?city=London`

### 2. Path Parameter Format
* **Endpoint:** `/api/weather/:city`
* **Method:** `GET`
* **Parameters:** `city` (path segment, required)
* **Example:** `http://localhost:5000/api/weather/Tokyo`

### Standard JSON Response
```json
{
  "city": "London, United Kingdom",
  "temperature": 16,
  "condition": "Partly Cloudy",
  "humidity": 59,
  "windSpeed": 19.1,
  "icon": "02d",
  "source": "Open-Meteo (Zero-Config Fallback)"
}
```

### Invalid City / Error Response (HTTP 404)
```json
{
  "error": "City not found: \"NonExistentCityName\""
}
```

---

## 🧪 Testing the API

### Method A: Web Browser (Interactive Dashboard)
Simply open your web browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)**

You can enter any city in the search bar or click on one of the quick buttons. The dashboard will automatically fetch from our custom API routes and update the UI immediately!

### Method B: Postman or API Clients
Import one of the following endpoints into Postman as a `GET` request:
1. `http://localhost:5000/api/weather?city=Paris`
2. `http://localhost:5000/api/weather/Rome`

### Method C: Terminal Shell (PowerShell)
You can fetch data directly from your command line:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/weather/Tokyo" | ConvertTo-Json
```
