document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const searchForm = document.getElementById('search-form');
  const countryInput = document.getElementById('country-input');
  const quickButtons = document.querySelectorAll('.btn-quick');
  const loader = document.getElementById('loader');
  const errorCard = document.getElementById('error-card');
  const errorMessage = document.getElementById('error-message');
  const newsGrid = document.getElementById('news-grid');

  // Submit Handler
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = countryInput.value.trim().toLowerCase();
    
    // UI input validation
    if (!/^[a-z]{2}$/.test(code)) {
      displayError('Invalid country code. Please enter exactly 2 alphabetical characters (e.g. us, jp, gb).');
      return;
    }

    // De-select quick buttons
    quickButtons.forEach(btn => btn.classList.remove('active'));
    
    fetchNewsStream(code);
  });

  // Quick Select Clicks
  quickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      countryInput.value = code.toUpperCase();
      
      // Update active toggle states
      quickButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      fetchNewsStream(code);
    });
  });

  // Date Formatter Helper
  function formatNewsDate(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }

  // Display Error Card Utility
  function displayError(msg) {
    errorMessage.textContent = msg;
    errorCard.classList.remove('hidden');
    loader.classList.add('hidden');
    newsGrid.classList.add('hidden');
  }

  // API Fetch Engine
  async function fetchNewsStream(countryCode) {
    loader.classList.remove('hidden');
    errorCard.classList.add('hidden');
    newsGrid.classList.add('hidden');

    try {
      const response = await fetch(`/api/news?country=${encodeURIComponent(countryCode)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture news stream.');
      }

      // Empty states check
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`No headlines returned for country code "${countryCode.toUpperCase()}".`);
      }

      // Clean grid and generate cards
      newsGrid.innerHTML = '';

      data.forEach(article => {
        const card = document.createElement('article');
        card.className = 'news-card glass';

        // Mouse Tracker effect (Premium radial spotlight gradient)
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--x', `${x}px`);
          card.style.setProperty('--y', `${y}px`);
        });

        const formattedDate = formatNewsDate(article.publishedAt);

        card.innerHTML = `
          <div class="card-header">
            <span class="badge-source" title="${article.source}">${article.source}</span>
            <span class="pub-date">${formattedDate}</span>
          </div>
          <h3 class="news-title" title="${article.title}">${article.title}</h3>
          <a href="${article.url}" target="_blank" class="btn-read">
            Read Full Story
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        `;

        newsGrid.appendChild(card);
      });

      // Reveal completed grid
      newsGrid.classList.remove('hidden');

    } catch (err) {
      console.error('[News Client] fetch error:', err);
      displayError(err.message);
    } finally {
      loader.classList.add('hidden');
    }
  }

  // Load US as active default on load
  const usButton = document.querySelector('.btn-quick[data-code="us"]');
  if (usButton) usButton.classList.add('active');
  fetchNewsStream('us');
});
