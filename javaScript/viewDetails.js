// Asynchronous function to load the navbar content
async function loadNavbar() {
  try {
    const response = await fetch("navbar.html"); // Fetching the navbar HTML content
    const html = await response.text(); // Extracting text content from the response
    document.getElementById("navbarPlaceholder").innerHTML = html; // Setting the navbar HTML content to the placeholder element
  } catch (error) {
    console.error("Error loading navbar:", error); // Logging error if fetching fails
  }
}

// Function to display superhero details on the page
function displaySuperheroDetails(superhero) {
  console.log("aaaaa", superhero); // Logging superhero details
  // Generating HTML content to display superhero details
  const content = `
        <div class="d-flex justify-content-center">
            <div class="card custom-border" style="max-width: 900px;">
                <div class="row">
                    <div class="col-md-5">
                        <img src="${superhero.thumbnail?.path}.${superhero.thumbnail?.extension}" class="card-img-top img-fluid" style="height: 100%; object-fit: cover;" alt="${superhero.name}">
                    </div>
                    <div class="col-md-7">
                        <div class="card-body">
                            <div id="details">
                                <h2 class="card-title pb-3">Name: ${superhero.name}</h2>
                                <p>
                                    <strong class="sub-name">ID:</strong> ${superhero.id || "ID not available"}<br>
                                    <strong class="sub-name">Stories:</strong> ${superhero.stories || "No Comics available"}<br>
                                    <strong class="sub-name">Comics:</strong> ${superhero.comics || "No Comics available"}<br>
                                    <strong class="sub-name">Events:</strong> ${superhero.events || "No events available"}<br>
                                    <strong class="sub-name">Series:</strong> ${superhero.series || "No Series available"}<br>
                                    <strong class="sub-name">Description:</strong> ${superhero.description || "No description available"}<br>
                                </p>
                            </div>
                            <div id="homePageButton" class="mb-1 text-center">
                                <a href="index.html" class="btn viewBtn">Back to Home</a> <!-- Button to go back to the home page -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  document.getElementById("superheroDetailsContainer").innerHTML = content; // Setting the superhero details content to the container element
}

// Event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", async function () {
  await loadNavbar(); // Loading the navbar content

  // Parsing URL parameters to get the superhero name
  const urlParams = new URLSearchParams(window.location.search);
  const superheroName = urlParams.get("name");

  // Parsing the decoded superhero name JSON and displaying superhero details
  const superhero = JSON.parse(decodeURIComponent(superheroName));
  displaySuperheroDetails(superhero);
});
