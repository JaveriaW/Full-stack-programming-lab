require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock Headlines Database for Zero-Config Fallback (Structured exactly like final JSON format)
const mockNewsDatabase = {
  us: [
    {
      title: "NASA Webb Telescope Detects Liquid Water Signatures on Exoplanet K2-18b",
      source: "Space Exploration News",
      url: "https://space.nasa.gov/webb-k2-18b-water",
      publishedAt: "2026-05-20T08:30:00Z"
    },
    {
      title: "Federal Reserve Holds Interest Rates Steady, Citing Stabilized Inflation Targets",
      source: "The Wall Street Journal",
      url: "https://wsj.finance/fed-rates-may2026",
      publishedAt: "2026-05-20T07:15:00Z"
    },
    {
      title: "OpenAI Launches GPT-6 Omni: Achieving Advanced Multi-Modal Common Sense Reasoning",
      source: "TechCrunch",
      url: "https://techcrunch.com/openai-gpt6-launch",
      publishedAt: "2026-05-20T06:00:00Z"
    },
    {
      title: "Apple Announces New Spatial Computing System Integrated with Lightweight Glasses",
      source: "Wired",
      url: "https://wired.com/apple-spatial-glasses-reveal",
      publishedAt: "2026-05-20T05:40:00Z"
    },
    {
      title: "Global Summit Agrees on Landmark Accord to Regulate Autonomous Robotic Safety",
      source: "Reuters",
      url: "https://reuters.com/global-autonomous-robot-accord",
      publishedAt: "2026-05-20T04:20:00Z"
    },
    {
      title: "Championship Finals: Underdog Victory Stuns Crowd in Dramatic Triple-Overtime Finish",
      source: "ESPN",
      url: "https://espn.com/championship-finals-underdog-win",
      publishedAt: "2026-05-20T03:10:00Z"
    },
    {
      title: "FDA Approves Breakthrough Single-Dose Gene Therapy for Chronic Neuropathy",
      source: "Medical News Today",
      url: "https://medicalnewstoday.com/fda-gene-therapy-approval",
      publishedAt: "2026-05-20T02:00:00Z"
    },
    {
      title: "Renewable Grid Expansion: Wind and Solar Account for 60% of Energy Generation in Q1",
      source: "Bloomberg Green",
      url: "https://bloomberg.com/green-renewable-energy-growth",
      publishedAt: "2026-05-20T01:15:00Z"
    }
  ],
  gb: [
    {
      title: "DeepMind AlphaFold 4 Models Complex Biological Interactions with High Fidelity",
      source: "BBC News",
      url: "https://bbc.co.uk/news/deepmind-alphafold4-biology",
      publishedAt: "2026-05-20T08:10:00Z"
    },
    {
      title: "London FinTech Innovators Double Venture Funding Records Despite Global Squeeze",
      source: "Financial Times",
      url: "https://ft.com/london-fintech-funding-records",
      publishedAt: "2026-05-20T07:30:00Z"
    },
    {
      title: "British Museum Unveils Newly Restored Bronze Age Treasures After Five-Year Project",
      source: "The Guardian",
      url: "https://theguardian.com/culture/british-museum-bronze-age-treasures",
      publishedAt: "2026-05-20T06:50:00Z"
    },
    {
      title: "Offshore Wind Mega-Project Off Scottish Coast Commences Commercial Power Generation",
      source: "Sky News",
      url: "https://news.sky.com/scotland-offshore-wind-project",
      publishedAt: "2026-05-20T05:25:00Z"
    },
    {
      title: "Premier League Drama: Dramatic Last-Minute Goal Secures Top-Four Champions League Spot",
      source: "BBC Sport",
      url: "https://bbc.co.uk/sport/football-premier-league-drama",
      publishedAt: "2026-05-20T04:05:00Z"
    },
    {
      title: "Electric Double-Decker Fleets Expand Across Greater Manchester Transport Grid",
      source: "Manchester Evening News",
      url: "https://manchestereveningnews.co.uk/electric-bus-expansion",
      publishedAt: "2026-05-20T02:40:00Z"
    },
    {
      title: "Royal Society Awards Prestigious Copley Medal to Climate Modelling Scientists",
      source: "Nature UK",
      url: "https://nature.com/articles/royal-society-copley-medal-winners",
      publishedAt: "2026-05-20T01:30:00Z"
    }
  ],
  jp: [
    {
      title: "Toyota Showcases Gen-2 Solid-State Batteries promising 1000km range for EVs",
      source: "The Japan Times",
      url: "https://japantimes.co.jp/business/toyota-solid-state-battery-gen2",
      publishedAt: "2026-05-20T08:45:00Z"
    },
    {
      title: "JAXA H3 Rocket Successfully Deploys Environmental Observation Satellite into Orbit",
      source: "NHK World",
      url: "https://nhk.or.jp/world/jaxa-h3-satellite-launch",
      publishedAt: "2026-05-20T07:20:00Z"
    },
    {
      title: "Cyberpunk Aesthetic: Kyoto Historical Districts Test Warm Subtle LED Lantern Integrations",
      source: "Kyoto Shimbun",
      url: "https://kyoto-np.co.jp/culture/historical-districts-led-lights",
      publishedAt: "2026-05-20T06:10:00Z"
    },
    {
      title: "Tokyo Art Scene: Mori Museum Opens Immersive Digital Reality Painting Exhibition",
      source: "Spoon & Tamago",
      url: "https://spoon-tamago.com/tokyo-mori-museum-digital-reality",
      publishedAt: "2026-05-20T05:00:00Z"
    },
    {
      title: "Supercomputing Leadership: Fugaku-Next Achieves 10x Operational Speed Increments",
      source: "Nikkei Asia",
      url: "https://asia.nikkei.com/tech/supercomputing-fugaku-next-leads",
      publishedAt: "2026-05-20T03:50:00Z"
    },
    {
      title: "Cherry Blossom Preservation: Foresters Deploy Biosensors to Protect Ancient Sakura",
      source: "Asahi Shimbun",
      url: "https://asahi.com/sakura-biosensor-preservation",
      publishedAt: "2026-05-20T02:15:00Z"
    }
  ],
  in: [
    {
      title: "ISRO Gaganyaan Mission: Astronauts Complete Second Stage of Simulated Spaceflight Tests",
      source: "The Times of India",
      url: "https://timesofindia.indiatimes.com/isro-gaganyaan-spaceflight-simulation",
      publishedAt: "2026-05-20T08:50:00Z"
    },
    {
      title: "Unified Payments Interface (UPI) Expands Globally, Partnering with Major Central Banks",
      source: "Economic Times",
      url: "https://economictimes.indiatimes.com/upi-global-bank-partnerships",
      publishedAt: "2026-05-20T07:40:00Z"
    },
    {
      title: "Tech Corridors: Bangalore and Hyderabad Account for 45% of New Global AI Incubators",
      source: "YourStory",
      url: "https://yourstory.com/bangalore-hyderabad-ai-incubators-expansion",
      publishedAt: "2026-05-20T06:20:00Z"
    },
    {
      title: "Major Green Hydrogen Facility Inaugurated in Gujarat, Paving Way for Net-Zero Logistics",
      source: "The Hindu",
      url: "https://thehindu.com/gujarat-green-hydrogen-plant-inauguration",
      publishedAt: "2026-05-20T05:10:00Z"
    },
    {
      title: "Cricket Championship: Epic Century Guides National Team to Semifinal Berth in Style",
      source: "Cricbuzz",
      url: "https://cricbuzz.com/championship-semifinal-century",
      publishedAt: "2026-05-20T03:45:00Z"
    },
    {
      title: "Classical Sanskrit Texts Digitized Using Specialized Optical AI Transcription Models",
      source: "Hindustan Times",
      url: "https://hindustantimes.com/classical-sanskrit-ai-digitization",
      publishedAt: "2026-05-20T01:50:00Z"
    }
  ],
  au: [
    {
      title: "Great Barrier Reef Recovers High Coral Cover in Core Southern Regions, Survey Finds",
      source: "The Sydney Morning Herald",
      url: "https://smh.com.au/environment/reef-coral-recovery-survey",
      publishedAt: "2026-05-20T08:15:00Z"
    },
    {
      title: "Australian Quantum Computing Startups Secure Mega Grants to Build High-Qubit Cores",
      source: "Tech Guide Australia",
      url: "https://techguide.com.au/quantum-computing-grants-australia",
      publishedAt: "2026-05-20T07:10:00Z"
    },
    {
      title: "Solar Arrays Installed in Outback Northern Territory Grid Begin Dispatching Utility Load",
      source: "ABC News Australia",
      url: "https://abc.net.au/outback-solar-utility-dispatch",
      publishedAt: "2026-05-20T05:30:00Z"
    },
    {
      title: "National Football League Grand Finale Tickets Sell Out in Record Twelve Minutes",
      source: "Fox Sports Australia",
      url: "https://foxsports.com.au/grand-finale-ticket-sellout",
      publishedAt: "2026-05-20T04:20:00Z"
    },
    {
      title: "Marine Biologists Tag Giant Manta Rays Off Ningaloo Reef to Trace Migrations",
      source: "Australian Geographic",
      url: "https://australiangeographic.com.au/ningaloo-giant-manta-tagging",
      publishedAt: "2026-05-20T02:10:00Z"
    }
  ],
  fr: [
    {
      title: "Decentralized Green Energy Co-Ops Surge in Western France, Powering Entire Communes",
      source: "Le Monde",
      url: "https://lemonde.fr/energies-cooperatives-ouest",
      publishedAt: "2026-05-20T08:00:00Z"
    },
    {
      title: "Paris Fashion Week Highlights Sustainable Eco-Textiles and Zero-Waste Couture Runway Projects",
      source: "Vogue France",
      url: "https://vogue.fr/paris-fashion-week-eco-textiles",
      publishedAt: "2026-05-20T07:05:00Z"
    },
    {
      title: "Historical Excavations at Notre-Dame Reveal Intact Medieval Stonework and Vault Slabs",
      source: "France 24",
      url: "https://france24.com/notre-dame-medieval-stonework-excavation",
      publishedAt: "2026-05-20T05:50:00Z"
    },
    {
      title: "High-Speed Rail TGV-Next Launches Operational Test Runs Connecting Paris and Lyon",
      source: "Le Figaro",
      url: "https://lefigaro.fr/tgv-next-paris-lyon-test",
      publishedAt: "2026-05-20T04:15:00Z"
    },
    {
      title: "Louvre Museum Welcomes Rare Renaissance Drawings Collection on Special Extended Loan",
      source: "L'Art France",
      url: "https://lart.fr/louvre-renaissance-drawings-loan",
      publishedAt: "2026-05-20T02:30:00Z"
    }
  ]
};

// Core Business Logic: Fetch Headlines
async function fetchNewsHeadlines(countryCode) {
  const code = countryCode.toLowerCase();
  const apiKey = process.env.NEWS_API_KEY;

  // 1. Try external NewsAPI if a key is loaded
  if (apiKey && apiKey.trim() !== '') {
    console.log(`[NewsService] Querying NewsAPI.org for country: "${code}"`);
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${code}&apiKey=${apiKey}`;
      const response = await axios.get(url);
      
      const articles = response.data.articles || [];
      
      // Filter out removed or broken articles and limit to 5-10
      const filtered = articles
        .filter(art => art && art.title && art.title !== '[Removed]' && art.url)
        .slice(0, 10)
        .map(art => ({
          title: art.title,
          source: art.source ? art.source.name : 'Unknown News Agency',
          url: art.url,
          publishedAt: art.publishedAt || new Date().toISOString()
        }));

      // In case the API works but returns empty headlines, let's gracefully load mock data if we have it
      if (filtered.length === 0 && mockNewsDatabase[code]) {
        console.log(`[NewsService] NewsAPI returned empty articles. Using mock fallback for "${code}".`);
        return mockNewsDatabase[code];
      }

      return filtered;
    } catch (error) {
      console.warn(`[NewsService] NewsAPI call failed: ${error.message}. Checking fallback database.`);
      // If the city code/country code is wrong and NewsAPI says so, handle it
      if (error.response && error.response.status === 400) {
        throw new Error('Invalid country code');
      }
      // If auth error or network error, let's fall through to Mock database!
    }
  }

  // 2. High-Fidelity Mock Fallback Driver
  console.log(`[NewsService] Invoking Fallback Driver for country: "${code}"`);
  
  if (mockNewsDatabase[code]) {
    // Return standard mock dataset
    return mockNewsDatabase[code];
  } else {
    // If country is not in mock DB and no key is configured, tell the user to set a key
    if (!apiKey || apiKey.trim() === '') {
      throw new Error(`Country code "${code.toUpperCase()}" is not available in mock fallback mode. To retrieve articles for all international regions, please add a valid 'NEWS_API_KEY' in your .env file!`);
    } else {
      throw new Error('Country news articles unavailable');
    }
  }
}

// Input Validation Helper
function isValidCountryCode(country) {
  if (!country) return false;
  // Country codes should be ISO 2-letter codes
  const regex = /^[a-zA-Z]{2}$/;
  return regex.test(country);
}

// REST Routes

// 1. GET /api/news - Query parameters e.g., /api/news?country=us
app.get('/api/news', async (req, res) => {
  const country = req.query.country;

  if (!country || country.trim() === '') {
    return res.status(400).json({ error: 'Country code parameter is required. (e.g. ?country=us)' });
  }

  const cleanCountry = country.trim();
  if (!isValidCountryCode(cleanCountry)) {
    return res.status(400).json({ error: `Invalid country code: "${cleanCountry}". Country codes must be exactly 2 alphabetic letters (ISO 3166-1 alpha-2).` });
  }

  try {
    const headlines = await fetchNewsHeadlines(cleanCountry);
    return res.json(headlines);
  } catch (error) {
    if (error.message.includes('Invalid country code') || error.message.includes('not available in mock fallback')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: `Failed to retrieve headlines: ${error.message}` });
  }
});

// 2. GET /api/news/:country - Route path parameters e.g., /api/news/gb
app.get('/api/news/:country', async (req, res) => {
  const country = req.params.country;

  if (!country || country.trim() === '') {
    return res.status(400).json({ error: 'Country code parameter is required.' });
  }

  const cleanCountry = country.trim();
  if (!isValidCountryCode(cleanCountry)) {
    return res.status(400).json({ error: `Invalid country code: "${cleanCountry}". Country codes must be exactly 2 alphabetic letters (ISO 3166-1 alpha-2).` });
  }

  try {
    const headlines = await fetchNewsHeadlines(cleanCountry);
    return res.json(headlines);
  } catch (error) {
    if (error.message.includes('Invalid country code') || error.message.includes('not available in mock fallback')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: `Failed to retrieve headlines: ${error.message}` });
  }
});

// Server bootstrapper
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`News Headlines API Server is running on port ${PORT}`);
  console.log(`Open in Browser: http://localhost:${PORT}`);
  console.log(`API endpoints available:`);
  console.log(`  - GET http://localhost:${PORT}/api/news?country=us`);
  console.log(`  - GET http://localhost:${PORT}/api/news/us`);
  console.log(`==================================================`);
});
