let games = [];

// Load games from JSON
async function loadGames() {
    try {
        const response = await fetch('games.json');
        games = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Błąd ładowania gier:', error);
        alert('Nie udało się załadować listy gier. Sprawdź czy plik games.json istnieje.');
    }
}

// Initialize the app
function initializeApp() {
    displayAllGames();
    displayGamesByPlan();
    setupSearchListener();
    // Auto-calculate lost games since migration tab is now default
    calculateLostGames();
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('[id^="tab-"]').forEach(tab => {
        tab.classList.remove('tab-active');
        tab.classList.add('tab-inactive');
    });
    
    // Show selected content
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    
    // Add active class to selected tab
    const activeTab = document.getElementById(`tab-${tabName}`);
    activeTab.classList.add('tab-active');
    activeTab.classList.remove('tab-inactive');
    
    // Auto-calculate lost games when switching to migration tab
    if (tabName === 'migration' && games.length > 0) {
        calculateLostGames();
    }
}

// Setup search listener
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        displayFilteredGames(query);
    });
}

// Display all games in search tab
function displayAllGames() {
    displayFilteredGames('');
}

// Display filtered games
function displayFilteredGames(query) {
    const searchResults = document.getElementById('searchResults');
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(query)
    );
    
    if (filteredGames.length === 0) {
        searchResults.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 text-lg">Nie znaleziono gier pasujących do zapytania "${query}"</p>
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = filteredGames.map(game => {
        const searchUrl = `https://www.xbox.com/pl-pl/Search/Results?q=${encodeURIComponent(game.title)}`;
        const planIcons = {
            'essentials': '<span title="Essentials" class="text-xs">Essentials 🪙</span>',
            'premium': '<span title="Premium" class="text-xs">Premium 💰</span>',
            'ultimate': '<span title="Ultimate" class="text-xs">Ultimate 💵</span>'
        };
        return `
        <div class="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition border border-gray-200">
            <div class="flex items-center justify-between gap-3">
                <h3 class="font-semibold text-base text-gray-900 flex-1">${game.title}</h3>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <div class="flex items-center">
                        ${game.plans.map(plan => planIcons[plan]).join('<span class="text-gray-400 mx-1">/</span>')}
                    </div>
                    <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" 
                       class="text-blue-600 hover:text-blue-800" title="Wyszukaj w sklepie">
                        🔍
                    </a>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// Display games by plan in compare tab
function displayGamesByPlan() {
    const plans = ['essentials', 'premium', 'ultimate'];
    
    plans.forEach(plan => {
        const gamesInPlan = games.filter(game => game.plans.includes(plan));
        const container = document.getElementById(`games-${plan}`);
        const counter = document.getElementById(`count-${plan}`);
        
        counter.textContent = gamesInPlan.length;
        
        container.innerHTML = gamesInPlan
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(game => {
                const searchUrl = `https://www.xbox.com/pl-pl/Search/Results?q=${encodeURIComponent(game.title)}`;
                return `
                <div class="text-sm text-gray-700 py-2 border-b border-gray-100 last:border-0">
                    <div class="flex justify-between items-center">
                        <span>${game.title}</span>
                        <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" 
                           class="text-blue-600 hover:text-blue-800 text-xs" title="Wyszukaj w sklepie">
                            🔍
                        </a>
                    </div>
                </div>
            `;
            }).join('');
    });
}

// Store lost games globally for filtering
let currentLostGames = [];

// Calculate lost games when migrating plans
function calculateLostGames() {
    const currentPlan = document.getElementById('currentPlan').value;
    const newPlan = document.getElementById('newPlan').value;
    
    // Define plan hierarchy
    const planHierarchy = {
        'ultimate': 3,
        'premium': 2,
        'essentials': 1,
        'none': 0
    };
    
    // Check if it's the same plan or upgrade
    if (currentPlan === newPlan || planHierarchy[newPlan] >= planHierarchy[currentPlan]) {
        // Hide results and show message
        document.getElementById('lostGamesResult').classList.add('hidden');
        document.getElementById('noLostGames').classList.add('hidden');
        return;
    }
    
    // Get games in current plan
    const currentGames = games.filter(game => game.plans.includes(currentPlan));
    
    // Get games that will be lost
    let lostGames;
    if (newPlan === 'none') {
        lostGames = currentGames;
    } else {
        lostGames = currentGames.filter(game => !game.plans.includes(newPlan));
    }
    
    // Display results
    const lostGamesResult = document.getElementById('lostGamesResult');
    const noLostGames = document.getElementById('noLostGames');
    const lostGamesList = document.getElementById('lostGamesList');
    const lostGamesTitle = document.getElementById('lostGamesTitle');
    
    if (lostGames.length === 0) {
        lostGamesResult.classList.add('hidden');
        noLostGames.classList.remove('hidden');
        currentLostGames = [];
    } else {
        noLostGames.classList.add('hidden');
        lostGamesResult.classList.remove('hidden');
        
        // Store sorted lost games globally
        currentLostGames = lostGames.sort((a, b) => a.title.localeCompare(b.title));
        
        // Setup filter listener
        const filterInput = document.getElementById('lostGamesFilter');
        filterInput.value = ''; // Clear filter
        filterInput.removeEventListener('input', filterLostGames); // Remove old listener
        filterInput.addEventListener('input', filterLostGames); // Add new listener
        
        // Display all lost games
        displayLostGames(currentLostGames);
    }
}

// Filter lost games based on search query
function filterLostGames(e) {
    const query = e.target.value.toLowerCase();
    const filtered = currentLostGames.filter(game => 
        game.title.toLowerCase().includes(query)
    );
    displayLostGames(filtered);
}

// Display lost games list
function displayLostGames(gamesToDisplay) {
    const lostGamesList = document.getElementById('lostGamesList');
    const lostGamesTitle = document.getElementById('lostGamesTitle');
    
    lostGamesTitle.textContent = `⚠️ Utracisz dostęp do następujących ${currentLostGames.length} gier${gamesToDisplay.length !== currentLostGames.length ? ` (pokazano ${gamesToDisplay.length})` : ''}:`;
    
    if (gamesToDisplay.length === 0) {
        lostGamesList.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-600">Nie znaleziono gier pasujących do filtra</p>
            </div>
        `;
        return;
    }
    
    lostGamesList.innerHTML = gamesToDisplay
        .map(game => {
            const searchUrl = `https://www.xbox.com/pl-pl/Search/Results?q=${encodeURIComponent(game.title)}`;
            const planIcons = {
                'essentials': '<span title="Essentials" class="text-xs">Essentials 🪙</span>',
                'premium': '<span title="Premium" class="text-xs">Premium 💰</span>',
                'ultimate': '<span title="Ultimate" class="text-xs">Ultimate 💵</span>'
            };
            return `
            <div class="bg-white rounded-lg p-3 border border-red-200">
                <div class="flex items-center justify-between gap-3">
                    <p class="font-semibold text-gray-900 flex-1">${game.title}</p>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <div class="flex items-center">
                            ${game.plans.map(plan => planIcons[plan]).join('<span class="text-gray-400 mx-1">/</span>')}
                        </div>
                        <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" 
                           class="text-blue-600 hover:text-blue-800" title="Wyszukaj w sklepie">
                            🔍
                        </a>
                    </div>
                </div>
            </div>
        `;
        }).join('');
}

// Load games when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    
    // Set default values for migration tab
    document.getElementById('currentPlan').value = 'ultimate';
    document.getElementById('newPlan').value = 'premium';
    
    // Ensure migration tab is properly initialized as active
    switchTab('migration');
});
