// Function to load the navigation bar from an external HTML file
function loadNavbar() {
    // Fetching the 'navbar.html' file
    fetch('navbar.html')
        .then(response => response.text()) // Converting the response to text
        .then(html => {
            // Setting the innerHTML of the 'navbarPlaceholder' div with the fetched HTML content
            document.getElementById('navbarPlaceholder').innerHTML = html;
        })
        .catch(error => console.error('Error loading navbar:', error)); // Handling errors
}

// Event listener to execute 'loadNavbar' function when DOM content is loaded
document.addEventListener('DOMContentLoaded', loadNavbar);

// Retrieving favorites list from localStorage or initializing an empty array
let favoritesList = JSON.parse(localStorage.getItem('favoritesList')) || [];

// Getting reference to the 'favoritesContainer' div
const favoritesContainer = document.getElementById('favoritesContainer');

// Function to create a card for each favorite superhero
function createCard(character) {
    // Creating a div element for the card
    const card = document.createElement('div');
    card.className = 'card'; // Adding 'card' class to the div

    // HTML content for the card
    const content = `
        <img id="characterImage" src="${character.thumbnail.path}.${character.thumbnail.extension}">
        <h5 class="card-title" title="${character.name}" id="characterName">${character.name}</h5>
        <div class="card-footer" id="cardBody">
            <button class="btn viewBtn" type="button" onClick="viewDetails(${character.id})">View Details</button>
            <button class="btn rmvFavBtn" type="button" onClick="removeFromFavorites(${character.id})">Remove from favorites</button>
        </div>`;
    
    card.innerHTML = content; // Setting the innerHTML of the card with the content

    return card; // Returning the created card
}

// Function to display the favorite superheroes
function displayFavorites() {
    favoritesContainer.innerHTML = ''; // Clearing the container

    // If no favorites added yet, display a message
    if (favoritesList.length === 0) {
        favoritesContainer.innerHTML = '<div class="notFound"><h3>No favorite superheroes added yet!!!</h3></div>';
        return;
    }

    // Iterating through each favorite superhero and creating/displaying their card
    favoritesList.forEach((character) => {
        const card = createCard(character);
        favoritesContainer.appendChild(card);
    });
}

// Function to remove a superhero from favorites
function removeFromFavorites(id) {
    // Filtering out the superhero with the provided id from favoritesList
    favoritesList = favoritesList.filter((character) => character.id !== id);
    // Storing the updated favoritesList in localStorage
    localStorage.setItem('favoritesList', JSON.stringify(favoritesList));
    // Re-displaying the favorites
    displayFavorites();
}

// Function to view details of a superhero
function viewDetails(id) {
    // Finding the superhero with the provided id from favoritesList
    const character = favoritesList.find((char) => char.id === id);
    if (character) {
        // Constructing selected data to pass to the viewDetails page
        const selectedData = {
            id: character.id,
            name: character.name,
            thumbnail: character.thumbnail,
            stories: character.stories?.available,
            comics: character.comics?.available,
            events: character.events?.available,
            series: character.series?.available,
            description: character.description
        };
        // Encoding the selected data and redirecting to viewDetails page
        const newData = encodeURIComponent(JSON.stringify(selectedData));
        window.location.href = `viewDetails.html?name=${newData}`;
    }
}

// Displaying the favorite superheroes
displayFavorites();
