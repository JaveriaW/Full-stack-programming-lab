# GlobalNews | Premium News Headlines REST API & Dashboard

GlobalNews is a sleek, responsive, and robust News Headlines REST API built from scratch using **Node.js** and **Express.js**. It features a dual-service backend integration driver that dynamically switches between the official **NewsAPI.org API** and a zero-config, highly-accurate **mock database fallback** containing authentic global news coverage for the core countries (US, UK, Japan, Australia, India, France). This guarantees immediate, fully functional local testing with zero setup.

Complementing the backend is an interactive, stunning glassmorphic client-side dashboard that showcases premium aesthetics, micro-animations, a responsive news grid, and an interactive **mouse-tracking radial glow spotlight** on each article card.

---

## 🌟 Key Features

* **Dual Weather Drivers:**
  * **NewsAPI Driver:** Active immediately if a valid `NEWS_API_KEY` is present in the `.env` configuration.
  * **High-Fidelity Fallback:** Active by default. Returns a highly realistic, structured dataset of news headlines for primary global regions, ensuring the API is fully functional out-of-the-box.
* **Dual Endpoint Styles:** Fully compliant REST endpoint supporting both Query params (`?country=x`) and Route params (`/x`).
* **Sleek Article Restructuring:** Filters and slices the response payload to output exactly **5–10 articles** formatted into the required fields: Title, Source Name, News URL, and Publication Date.
* **Robust Input Validation:** Standardizes and validates ISO two-letter country codes, returning exact `400 Bad Request` or `404 Not Found` statuses.
* **Premium Client Dashboard:** Includes flag-based quick selector chips, manual search fields, elegant loading/error states, and card hover effects (3D scale and mouse position-based glow gradients).

---

## 📂 Project Architecture

```
Lab13- Task2/
├── public/                 # Static Frontend News Portal
│   ├── index.html          # Semantic HTML5 Layout & Structure
│   ├── style.css           # Premium CSS Variables, Animations, Glassmorphic Grid
│   └── app.js              # Client Fetch Operations, Mouse Trackers, DOM Generation
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
cd "Lab13- Task2"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Configuration (Optional)
If you wish to test the NewsAPI.org service, open the `.env` file and insert your API key:
```env
PORT=8000
NEWS_API_KEY=your_news_api_key_here
```
*Note: If left blank, the app will gracefully run using the live-like mock database fallback.*

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
* **Endpoint:** `/api/news`
* **Method:** `GET`
* **Parameters:** `country` (string, required)
* **Example:** `http://localhost:8000/api/news?country=us`

### 2. Path Parameter Format
* **Endpoint:** `/api/news/:country`
* **Method:** `GET`
* **Parameters:** `country` (path segment, required)
* **Example:** `http://localhost:8000/api/news/gb`

### Standard JSON Response
```json
[
  {
    "title": "NASA Webb Telescope Detects Liquid Water Signatures on Exoplanet K2-18b",
    "source": "Space Exploration News",
    "url": "https://space.nasa.gov/webb-k2-18b-water",
    "publishedAt": "2026-05-20T08:30:00Z"
  },
  {
    "title": "Federal Reserve Holds Interest Rates Steady, Citing Stabilized Inflation Targets",
    "source": "The Wall Street Journal",
    "url": "https://wsj.finance/fed-rates-may2026",
    "publishedAt": "2026-05-20T07:15:00Z"
  }
]
```

### Invalid Country Code Error Response (HTTP 400)
```json
{
  "error": "Invalid country code: \"xyz\". Country codes must be exactly 2 alphabetic letters (ISO 3166-1 alpha-2)."
}
```

---

## 🧪 Testing the API

### Method A: Web Browser (Interactive Dashboard)
Simply open your web browser and navigate to:
👉 **[http://localhost:8000](http://localhost:8000)**

Select any of the flag buttons or input custom ISO codes (like `in`, `jp`, `fr`) in the selector and press stream. The dashboard will automatically fetch from our custom API routes and update the headlines immediately!

### Method B: Postman or API Clients
Import one of the following endpoints into Postman as a `GET` request:
1. `http://localhost:8000/api/news?country=us`
2. `http://localhost:8000/api/news/gb`

### Method C: Terminal Shell (PowerShell)
You can fetch data directly from your command line:
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/news/jp" | ConvertTo-Json
```
