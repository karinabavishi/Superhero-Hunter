document.addEventListener("DOMContentLoaded", () => {
  loadNavbar(); // When the DOM content is loaded, load the navigation bar
  getData(); // Fetch data from Marvel API
});

// Object to hold references to important HTML elements
const elements = {
  homePage: document.getElementById("home"),
  favorpage: document.getElementById("favorites"),
  searchInput: document.getElementById("searchInput"),
  contentContainer: document.getElementById("contentContainer"),
  navbarPlaceholder: document.getElementById("navbarPlaceholder")
};

// Variable to store API response data
var responseData;

// Array to hold favorite superheroes; retrieving from localStorage or initializing as empty array
var favoritesList = JSON.parse(localStorage.getItem('favoritesList')) || [];

// Function to load the navbar from an external HTML file
function loadNavbar() {
  fetch("navbar.html")
    .then((response) => response.text())
    .then((html) => {
      elements.navbarPlaceholder.innerHTML = html;

      // Create search form dynamically and append to navbar
      const form = document.createElement("form");
      form.className = "d-flex";
      const input = document.createElement("input");
      input.className = "form-control me-2";
      input.id = "searchInput";
      input.type = "text";
      input.placeholder = "Search the superhero name";
      input.addEventListener("input", getSearchedData); // Add event listener for input
      form.appendChild(input);
      const navbarContent = document.getElementById("mynavbar");
      navbarContent.appendChild(form);
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

// Function to generate the API URL for fetching Marvel superhero data
function generateApiUrl() {
  const timeStamp = Date.now();
  const privateKey = "0f3923b31ec3754340b8c56f35daa43bd67975ab";
  const publicKey = "12c19385e8d36ec425b22fa17eeb7740";
  const hash = generateHash(timeStamp, privateKey, publicKey);
  return `https://gateway.marvel.com/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hash}`;
}

// Function to generate MD5 hash for authentication
function generateHash(timestamp, privateKey, publicKey) {
  const hashInput = timestamp + privateKey + publicKey;
  return CryptoJS.MD5(hashInput).toString();
}

// Function to fetch data from Marvel API
async function getData() {
  try {
      const response = await fetch(generateApiUrl());
      const data = await response.json();
      responseData = data; // Store response data
      updateData(); // Update the UI with fetched data
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

// Function to update the UI with fetched data or display a message if no data is available
function updateData(data = responseData.data.results) {
  elements.contentContainer.innerHTML = data
    ? generateCards(data)
    : '<h2 class="notFound">No Superhero found with this name!!!</h2>';
}

// Function to handle input event for searching superheroes
function getSearchedData() {
  const inputValue = document.getElementById('searchInput').value.toLowerCase();
  const filteredData = responseData.data.results.filter(character =>
      character.name.toLowerCase().includes(inputValue)
  );
  updateData(filteredData.length > 0 ? filteredData : null);
}

// Function to generate HTML cards for displaying superheroes
function generateCards(characters) {
  return characters.map((character) => `
      <div class="card">
          <img id="characterImage" src="${character.thumbnail.path}.${character.thumbnail.extension}">
          <h5 class="card-title" title="${character.name}" id="characterName">${character.name}</h5>
          <div class="card-footer" id="cardBody" id="buttons">
              <button class="btn viewBtn" type="button" onClick="viewDetails(${character.id})">View Details</button>
              <button class="btn ${isFav(character.id) ? 'rmvFavBtn' : 'addfavBtn'}" type="button" onClick="checkButton(${character.id})">${isFav(character.id) ? 'Remove from favorites' : 'Add to favorites'}</button>
          </div>
      </div>
  `).join("");
}

// Function to navigate to a details page for a superhero
function viewDetails(id) {
  const character = responseData.data.results.find((character) => character.id === id);
  if (character) {
      const selectedData = encodeURIComponent(JSON.stringify({
          id: character.id,
          name: character.name,
          thumbnail: character.thumbnail,
          stories: character.stories?.available,
          comics: character.comics?.available,
          events: character.events?.available,
          series: character.series?.available,
          description: character.description
      }));
      window.location.href = `viewDetails.html?name=${selectedData}`;
  }
}

// Function to check if a superhero is in the favorites list
function isFav(id) {
  return favoritesList.some((character) => character.id === id);
}

// Function to handle adding/removing superheroes from favorites list
function checkButton(id) {
  const index = favoritesList.findIndex((character) => character.id === id);
  if (index === -1) {
      const character = responseData.data.results.find((character) => character.id === id);
      if (character) favoritesList.push(character);
  } else {
      favoritesList.splice(index, 1);
  }
  localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
  updateData();
}
