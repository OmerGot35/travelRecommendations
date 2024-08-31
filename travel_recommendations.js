// Function to fetch travel recommendations from the JSON file
async function fetchRecommendations() {
    try {
        const response = await fetch('travel_recommendations_api.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching the recommendations:', error);
    }
}

// Function to match keywords
function matchKeyword(input, keywords) {
    input = input.toLowerCase();
    return keywords.some(keyword => input.includes(keyword.toLowerCase()));
}

// Function to filter recommendations based on keyword
function filterRecommendations(data, searchQuery) {
    const results = {
        beaches: [],
        temples: [],
        countries: []
    };

    if (matchKeyword(searchQuery, ['beach', 'beaches'])) {
        results.beaches = data.beaches.slice(0, 2); // Get first two beaches
    }

    if (matchKeyword(searchQuery, ['temple', 'temples'])) {
        results.temples = data.temples.slice(0, 2); // Get first two temples
    }

    if (matchKeyword(searchQuery, ['country', 'countries'])) {
        results.countries = data.countries.slice(0, 2).map(country => ({
            name: country.name,
            imageUrl: country.imageUrl,
            description: country.description
        }));
    }

    return results;
}

// Function to display recommendations as popups
function displayRecommendations(data, searchQuery) {
    const filteredResults = filterRecommendations(data, searchQuery);
    
    // Create popup container if it doesn't exist
    let popupContainer = document.getElementById('popupContainer');
    if (!popupContainer) {
        popupContainer = document.createElement('div');
        popupContainer.id = 'popupContainer';
        popupContainer.className = 'popup-container';
        document.body.appendChild(popupContainer);
    }
    
    popupContainer.innerHTML = ''; // Clear previous results
    
    // Add close button
    const closeButton = document.createElement('span');
    closeButton.className = 'close-popup';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
        popupContainer.style.display = 'none';
    };
    popupContainer.appendChild(closeButton);

    // Helper function to create and append a result item
    function createResultElement(name, imageUrl, description) {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        resultElement.innerHTML = `
            <h2>${name}</h2>
            <img src="${imageUrl}" alt="${name}" />
            <p>${description}</p>
        `;
        popupContainer.appendChild(resultElement);
    }

    // Display filtered results
    let resultsFound = false;
    
    for (const category in filteredResults) {
        filteredResults[category].forEach(item => {
            createResultElement(item.name, item.imageUrl, item.description);
            resultsFound = true;
        });
    }

    // Show popup if results were found
    if (resultsFound) {
        popupContainer.style.display = 'block';
    } else {
        popupContainer.style.display = 'none';
        alert('No results found for your search.');
    }
}

// Event listener for the search button
document.getElementById('btnSearch').addEventListener('click', async () => {
    const searchBar = document.getElementById('searchBar');
    const searchQuery = searchBar.value.trim();
    
    if (searchQuery === '') {
        alert('Please enter a search term.');
        return;
    }
    
    const data = await fetchRecommendations();
    if (data) {
        displayRecommendations(data, searchQuery);
    }
});

// Event listener for the reset button
document.getElementById('btnReset').addEventListener('click', () => {
    document.getElementById('searchBar').value = '';
    const popupContainer = document.getElementById('popupContainer');
    if (popupContainer) {
        popupContainer.style.display = 'none';
    }
});