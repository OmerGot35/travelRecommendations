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

// Function to display recommendations
function displayRecommendations(data) {
    const searchBar = document.getElementById('searchBar');
    const searchQuery = searchBar.value.toLowerCase();
    const resultsContainer = document.getElementById('resultsContainer');

    resultsContainer.innerHTML = ''; // Clear previous results

    // Helper function to create and append a result item
    function createResultElement(name, imageUrl, description) {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        resultElement.innerHTML = `
            <h2>${name}</h2>
            <img src="${imageUrl}" alt="${name}" />
            <p>${description}</p>
        `;
        resultsContainer.appendChild(resultElement);
    }

    // Iterate through the data and display matching results
    data.countries.forEach(country => {
        country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(searchQuery)) {
                createResultElement(city.name, city.imageUrl, city.description);
            }
        });
    });

    // Repeat similar logic for temples
    data.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(searchQuery)) {
            createResultElement(temple.name, temple.imageUrl, temple.description);
        }
    });

    // Repeat similar logic for beaches
    data.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(searchQuery)) {
            createResultElement(beach.name, beach.imageUrl, beach.description);
        }
    });
}

// Event listener for the search button
document.getElementById('btnSearch').addEventListener('click', async () => {
    const data = await fetchRecommendations();
    if (data) {
        displayRecommendations(data);
    }
});

// Event listener for the reset button
document.getElementById('btnReset').addEventListener('click', () => {
    document.getElementById('searchBar').value = '';
    document.getElementById('resultsContainer').innerHTML = ''; // Clear results
});
