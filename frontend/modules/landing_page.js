import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();

  // console.log("From init()");
  // console.log(`${config.backendEndpoint}`);

  // Updates the DOM with the cities
  //Updates the DOM with the cities
  if (cities) {
    cities.forEach((key) => {
      addCityToDOM(key.id, key.city, key.description, key.image);
    });
  }
}

//Implementation of fetch call
async function fetchCities() {
  try {
    let resData = await fetch(`${config.backendEndpoint}cities`);
    if (!resData.ok) {
      throw new Error(`HTTP error! Status: ${resData.status}`);
    }
    let data = await resData.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }

}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  const cityCard = document.createElement("div");
  cityCard.className = "col-12 col-md-6 col-lg-3 mb-4";

  cityCard.innerHTML = `
      <a href="pages/adventures/?city=${id}" id="${id}" class="text-decoration-none">
      <div class="tile">
        <img
          src="${image}"
          alt="${city}"
          class="card-img-top img-fluid"
        />
        <div
          class="tile-text text-white position-absolute bottom-0 w-100"
        >
          <h6>${city}</h6>
          <p>${description}</p>
        </div>
      </div>
    </a>
  `;
  document.getElementById("data").appendChild(cityCard);

}

export { init, fetchCities, addCityToDOM };
