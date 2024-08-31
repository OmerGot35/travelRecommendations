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
        cities: [],
        countries: []
    };

    // Search for cities
    const matchingCities = data.countries.flatMap(country => 
        country.cities.filter(city => matchKeyword(city.name, [searchQuery]))
    );

    if (matchingCities.length > 0) {
        results.cities = matchingCities;
    } else {
        // Search for countries and return all cities within the matched country
        const matchingCountry = data.countries.find(country =>
            matchKeyword(searchQuery, [country.name])
        );

        if (matchingCountry) {
            results.countries = matchingCountry.cities;
        }
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
    
    // Display city results
    if (filteredResults.cities.length > 0) {
        filteredResults.cities.forEach(city => {
            createResultElement(city.name, city.imageUrl, city.description);
            resultsFound = true;
        });
    }

    // Display country results
    if (filteredResults.countries.length > 0) {
        filteredResults.countries.forEach(city => {
            createResultElement(city.name, city.imageUrl, city.description);
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
