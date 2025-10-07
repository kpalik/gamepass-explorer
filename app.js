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
    
    searchResults.innerHTML = filteredGames.map(game => `
        <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
            <h3 class="font-bold text-lg text-gray-900 mb-3">${game.title}</h3>
            <div class="flex flex-wrap gap-2">
                ${game.plans.map(plan => {
                    const planNames = {
                        'essentials': 'Essentials',
                        'premium': 'Premium',
                        'ultimate': 'Ultimate'
                    };
                    return `<span class="plan-badge plan-${plan}">${planNames[plan]}</span>`;
                }).join('')}
            </div>
        </div>
    `).join('');
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
            .map(game => `
                <div class="text-sm text-gray-700 py-2 border-b border-gray-100 last:border-0">
                    ${game.title}
                </div>
            `).join('');
    });
}

// Calculate lost games when migrating plans
function calculateLostGames() {
    const currentPlan = document.getElementById('currentPlan').value;
    const newPlan = document.getElementById('newPlan').value;
    
    if (!currentPlan || !newPlan) {
        alert('Proszę wybrać oba plany');
        return;
    }
    
    if (currentPlan === newPlan) {
        alert('Wybierz różne plany');
        return;
    }
    
    // Define plan hierarchy
    const planHierarchy = {
        'ultimate': 3,
        'premium': 2,
        'essentials': 1,
        'none': 0
    };
    
    // Check if it's a downgrade
    if (planHierarchy[newPlan] >= planHierarchy[currentPlan]) {
        alert('Nowy plan musi być niższy niż obecny plan');
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
    const lostGamesCount = document.getElementById('lostGamesCount');
    
    if (lostGames.length === 0) {
        lostGamesResult.classList.add('hidden');
        noLostGames.classList.remove('hidden');
    } else {
        noLostGames.classList.add('hidden');
        lostGamesResult.classList.remove('hidden');
        
        lostGamesCount.textContent = lostGames.length;
        lostGamesList.innerHTML = lostGames
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(game => `
                <div class="bg-white rounded-lg p-3 border border-red-200">
                    <p class="font-semibold text-gray-900">${game.title}</p>
                    <div class="flex flex-wrap gap-1 mt-2">
                        ${game.plans.map(plan => {
                            const planNames = {
                                'essentials': 'Essentials',
                                'premium': 'Premium',
                                'ultimate': 'Ultimate'
                            };
                            return `<span class="plan-badge plan-${plan} text-xs">${planNames[plan]}</span>`;
                        }).join('')}
                    </div>
                </div>
            `).join('');
    }
}

// Load games when page loads
document.addEventListener('DOMContentLoaded', loadGames);
