// Country flag data - will be loaded from API
let countries = [];

// App state
let currentIndex = 0;
let isFlipped = false;
let correctCount = 0;
let attemptedCount = 0;
let currentDeck = [];
let isLoading = true;

// DOM elements
const flashcard = document.getElementById('flashcard');
const flagElement = document.getElementById('flag');
const countryName = document.getElementById('country-name');
const countryInfo = document.getElementById('country-info');
const currentCardSpan = document.getElementById('current-card');
const totalCardsSpan = document.getElementById('total-cards');
const correctSpan = document.getElementById('correct');
const attemptedSpan = document.getElementById('attempted');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const flipBtn = document.getElementById('flip-btn');
const knowBtn = document.getElementById('know-btn');
const dontKnowBtn = document.getElementById('dont-know-btn');
const shuffleBtn = document.getElementById('shuffle-btn');

// Fetch countries data from REST Countries API
async function fetchCountries() {
    try {
        showLoading(true);
        // Use CORS proxy for better compatibility
        const response = await fetch('https://restcountries.com/v3.1/all');
        
        if (!response.ok) {
            throw new Error('Failed to fetch countries');
        }
        
        const data = await response.json();
        
        // Transform the data to our format
        countries = data
            .map(country => ({
                name: country.name.common,
                capital: country.capital ? country.capital[0] : 'N/A',
                region: country.region || 'Unknown',
                subregion: country.subregion || '',
                population: country.population || 0,
                flag: country.flags.svg,
                cca2: country.cca2.toLowerCase()
            }))
            .filter(country => country.name && country.flag)
            .sort((a, b) => a.name.localeCompare(b.name));
        
        currentDeck = [...countries];
        isLoading = false;
        showLoading(false);
        init();
    } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback to loading from local data file
        loadLocalCountries();
    }
}

// Fallback to load countries from local JSON file
async function loadLocalCountries() {
    try {
        const response = await fetch('countries.json');
        const data = await response.json();
        countries = data.sort((a, b) => a.name.localeCompare(b.name));
        currentDeck = [...countries];
        isLoading = false;
        showLoading(false);
        init();
    } catch (error) {
        console.error('Error loading local countries:', error);
        showError();
    }
}

// Show/hide loading state
function showLoading(show) {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.querySelector('.flashcard-container');
    const controlsEl = document.querySelector('.controls');
    const actionsEl = document.querySelector('.actions');
    
    if (loadingEl) {
        loadingEl.style.display = show ? 'block' : 'none';
    }
    if (contentEl) {
        contentEl.style.display = show ? 'none' : 'block';
    }
    if (controlsEl) {
        controlsEl.style.display = show ? 'none' : 'flex';
    }
    if (actionsEl) {
        actionsEl.style.display = show ? 'none' : 'flex';
    }
}

// Show error message
function showError() {
    const flashcardInner = document.querySelector('.flashcard-inner');
    if (flashcardInner) {
        flashcardInner.innerHTML = `
            <div class="error-message">
                <h2>Failed to Load Countries</h2>
                <p>Please check your internet connection and refresh the page.</p>
                <button onclick="location.reload()" class="btn btn-primary">Retry</button>
            </div>
        `;
    }
}

// Initialize the app
function init() {
    totalCardsSpan.textContent = currentDeck.length;
    loadCard();
    updateStats();
}

// Load current card
function loadCard() {
    if (currentDeck.length === 0) return;
    
    const country = currentDeck[currentIndex];
    
    // If card is flipped, flip it back first and wait for animation to complete
    // before updating content to prevent the answer from flashing
    if (isFlipped) {
        flipCard();
        // Wait for flip animation to complete (600ms) before updating content
        setTimeout(() => {
            updateCardContent(country);
        }, 600);
    } else {
        updateCardContent(country);
    }
    
    currentCardSpan.textContent = currentIndex + 1;
    updateButtonStates();
}

// Update card content (separated to allow delayed updates)
function updateCardContent(country) {
    // Update flag with flag-icons CSS class
    flagElement.innerHTML = `<span class="fi fi-${country.cca2} flag-icon-large"></span>`;
    
    countryName.textContent = country.name;
    
    // Enhanced country info
    let info = `Capital: ${country.capital}`;
    if (country.region) {
        info += `<br>Region: ${country.region}`;
        if (country.subregion) {
            info += ` (${country.subregion})`;
        }
    }
    if (country.population) {
        info += `<br>Population: ${country.population.toLocaleString()}`;
    }
    countryInfo.innerHTML = info;
}

// Flip card
function flipCard() {
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

// Navigate to previous card
function previousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        loadCard();
    }
}

// Navigate to next card
function nextCard() {
    if (currentIndex < currentDeck.length - 1) {
        currentIndex++;
        loadCard();
    }
}

// Mark as known
function markAsKnown() {
    if (!isFlipped) {
        flipCard();
    }
    correctCount++;
    attemptedCount++;
    updateStats();
    setTimeout(() => {
        if (currentIndex < currentDeck.length - 1) {
            nextCard();
        }
    }, 500);
}

// Mark as unknown
function markAsUnknown() {
    if (!isFlipped) {
        flipCard();
    }
    attemptedCount++;
    updateStats();
    setTimeout(() => {
        if (currentIndex < currentDeck.length - 1) {
            nextCard();
        }
    }, 500);
}

// Shuffle deck
function shuffleDeck() {
    currentDeck = [...countries];
    for (let i = currentDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
    }
    currentIndex = 0;
    correctCount = 0;
    attemptedCount = 0;
    loadCard();
    updateStats();
}

// Update statistics
function updateStats() {
    correctSpan.textContent = correctCount;
    attemptedSpan.textContent = attemptedCount;
}

// Update button states
function updateButtonStates() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === currentDeck.length - 1;
}

// Event listeners
flashcard.addEventListener('click', flipCard);
flipBtn.addEventListener('click', flipCard);
prevBtn.addEventListener('click', previousCard);
nextBtn.addEventListener('click', nextCard);
knowBtn.addEventListener('click', markAsKnown);
dontKnowBtn.addEventListener('click', markAsUnknown);
shuffleBtn.addEventListener('click', shuffleDeck);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Don't interfere with keyboard navigation on buttons or inputs
    const activeElement = document.activeElement;
    const isInteractiveElement = activeElement.tagName === 'BUTTON' || 
                                  activeElement.tagName === 'INPUT' || 
                                  activeElement.tagName === 'SELECT';
    
    switch(e.key) {
        case 'ArrowLeft':
            previousCard();
            break;
        case 'ArrowRight':
            nextCard();
            break;
        case ' ':
        case 'Enter':
            // Only prevent default when not on interactive elements
            if (!isInteractiveElement) {
                e.preventDefault();
                flipCard();
            }
            break;
        case '1':
            markAsKnown();
            break;
        case '2':
            markAsUnknown();
            break;
    }
});

// Start the app
fetchCountries();
