// Country flag data with flag emoji, name, and capital
const countries = [
    { flag: '🇺🇸', name: 'United States', capital: 'Washington, D.C.' },
    { flag: '🇬🇧', name: 'United Kingdom', capital: 'London' },
    { flag: '🇫🇷', name: 'France', capital: 'Paris' },
    { flag: '🇩🇪', name: 'Germany', capital: 'Berlin' },
    { flag: '🇮🇹', name: 'Italy', capital: 'Rome' },
    { flag: '🇪🇸', name: 'Spain', capital: 'Madrid' },
    { flag: '🇨🇦', name: 'Canada', capital: 'Ottawa' },
    { flag: '🇯🇵', name: 'Japan', capital: 'Tokyo' },
    { flag: '🇨🇳', name: 'China', capital: 'Beijing' },
    { flag: '🇰🇷', name: 'South Korea', capital: 'Seoul' },
    { flag: '🇮🇳', name: 'India', capital: 'New Delhi' },
    { flag: '🇧🇷', name: 'Brazil', capital: 'Brasília' },
    { flag: '🇲🇽', name: 'Mexico', capital: 'Mexico City' },
    { flag: '🇦🇷', name: 'Argentina', capital: 'Buenos Aires' },
    { flag: '🇦🇺', name: 'Australia', capital: 'Canberra' },
    { flag: '🇷🇺', name: 'Russia', capital: 'Moscow' },
    { flag: '🇿🇦', name: 'South Africa', capital: 'Pretoria' },
    { flag: '🇪🇬', name: 'Egypt', capital: 'Cairo' },
    { flag: '🇳🇬', name: 'Nigeria', capital: 'Abuja' },
    { flag: '🇸🇪', name: 'Sweden', capital: 'Stockholm' },
    { flag: '🇳🇴', name: 'Norway', capital: 'Oslo' },
    { flag: '🇫🇮', name: 'Finland', capital: 'Helsinki' },
    { flag: '🇩🇰', name: 'Denmark', capital: 'Copenhagen' },
    { flag: '🇳🇱', name: 'Netherlands', capital: 'Amsterdam' },
    { flag: '🇧🇪', name: 'Belgium', capital: 'Brussels' },
    { flag: '🇨🇭', name: 'Switzerland', capital: 'Bern' },
    { flag: '🇦🇹', name: 'Austria', capital: 'Vienna' },
    { flag: '🇵🇱', name: 'Poland', capital: 'Warsaw' },
    { flag: '🇬🇷', name: 'Greece', capital: 'Athens' },
    { flag: '🇵🇹', name: 'Portugal', capital: 'Lisbon' },
    { flag: '🇹🇷', name: 'Turkey', capital: 'Ankara' },
    { flag: '🇸🇦', name: 'Saudi Arabia', capital: 'Riyadh' },
    { flag: '🇦🇪', name: 'United Arab Emirates', capital: 'Abu Dhabi' },
    { flag: '🇮🇱', name: 'Israel', capital: 'Jerusalem' },
    { flag: '🇹🇭', name: 'Thailand', capital: 'Bangkok' },
    { flag: '🇻🇳', name: 'Vietnam', capital: 'Hanoi' },
    { flag: '🇸🇬', name: 'Singapore', capital: 'Singapore' },
    { flag: '🇵🇭', name: 'Philippines', capital: 'Manila' },
    { flag: '🇮🇩', name: 'Indonesia', capital: 'Jakarta' },
    { flag: '🇲🇾', name: 'Malaysia', capital: 'Kuala Lumpur' },
];

// App state
let currentIndex = 0;
let isFlipped = false;
let correctCount = 0;
let attemptedCount = 0;
let currentDeck = [...countries];

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

// Initialize the app
function init() {
    totalCardsSpan.textContent = currentDeck.length;
    loadCard();
    updateStats();
}

// Load current card
function loadCard() {
    const country = currentDeck[currentIndex];
    flagElement.textContent = country.flag;
    countryName.textContent = country.name;
    countryInfo.textContent = `Capital: ${country.capital}`;
    
    // Reset flip state
    if (isFlipped) {
        flipCard();
    }
    
    currentCardSpan.textContent = currentIndex + 1;
    updateButtonStates();
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
    switch(e.key) {
        case 'ArrowLeft':
            previousCard();
            break;
        case 'ArrowRight':
            nextCard();
            break;
        case ' ':
        case 'Enter':
            e.preventDefault();
            flipCard();
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
init();
