
import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  let params = new URLSearchParams(search)
  let city = params.get('city'); 
  // console.log(city)
  return city;

}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  try{
    const resData = await fetch(`${config.backendEndpoint}adventures?city=${city}`);
    if(!resData.ok){
      throw new Error(`Failed to fetch adventures: ${resData.status}`)
    }
    const data = await resData.json();
    return data; 
  
  }catch(error){
    console.error("Errors :", error);
    return null;
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  const adventureElement = document.getElementById('data');
  adventureElement.innerHTML = ""
  adventures.forEach(adventure => {
    const adventureCard = document.createElement('div');
    adventureCard.className = "col-6 col-lg-3 mb-3";

//     adventureCard.innerHTML = `
//     <a id="${adventure.id}" href="detail/?adventure=${adventure.id}">
//     <div class="card activity-card">
//     <img src="${adventure.image}" class="card-img-top img" alt="${adventure.name}">
//     <div class="card-body d-flex justify-content-between">
//       <h6 class="card-title">${adventure.name}</h6>
//       <p class="card-text">₹${adventure.costPerHead}</p>
//     </div>
//     <div class="card-body d-flex justify-content-between">
//       <h6 class="card-title">Duration</h6>
//       <p class="card-text">${adventure.duration} Hours</p>
//     </div>
//     <div class="text-center">
//       <p class="category-banner-container">
//         <span class="category-banner">${adventure.category}</span>
//       </p>
//     </div>
//   </div>
//   </a>
// `;

adventureCard.innerHTML = `
<a id="${adventure.id}" href="detail/?adventure=${adventure.id}">
  <div class="activity-wrapper">
    <div class="card activity-card">
      <img src="${adventure.image}" class="card-img-top img" alt="${adventure.name}">
      <div class="card-body d-flex justify-content-between">
        <h6 class="card-title">${adventure.name}</h6>
        <p class="card-text">₹${adventure.costPerHead}</p>
      </div>
      <div class="card-body d-flex justify-content-between">
        <h6 class="card-title">Duration</h6>
        <p class="card-text">${adventure.duration} Hours</p>
      </div>
    </div>
    <div class="category-banner-container">
      <span class="category-banner">${adventure.category}</span>
    </div>
  </div>
</a>
`;
    adventureElement.appendChild(adventureCard);
  });

}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  return list.filter(adventure => {
    const duration = adventure.duration;
    return duration >=low && duration <= high; 
  });
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {

  return list.filter(adventure => categoryList.includes(adventure.category));

}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {

  //empty
  if(Object.values(filters).every(value => value ==="" || value.length === 0))return list;

  //duration
  let durationFilter = null;
  if(filters.duration){
    durationFilter = filters.duration.split('-').map(Number);
  }
  let filteredList = list;

  // category 

  if(filters.category && filters.category.length > 0){
    filteredList = filterByCategory(filteredList, filters.category);
  }

  // duration 
  if(durationFilter){
    filteredList = filterByDuration(filteredList, durationFilter[0], durationFilter[1]);
  }

  // Place holder for functionality to work in the Stubs
  return filteredList;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {

  const filteredString = JSON.stringify(filters);

  localStorage.setItem('filters', filteredString);

  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {

  const filteredString = localStorage.getItem('filters');

  if(filteredString)return JSON.parse(filteredString);

  // Place holder for functionality to work in the Stubs
  return null;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {

  //clearing
  const categoryListElement = document.getElementById('category-list');
  categoryListElement.innerHTML = '';

  // Generate new category pills
  if (filters.category && filters.category.length > 0) {
    filters.category.forEach(category => {
        const categoryPill = document.createElement('span');
        categoryPill.className = 'category-filter';
        categoryPill.textContent = category;


        // Add the pill to the DOM
        categoryListElement.appendChild(categoryPill);
    });
  }

  if (filters.duration) {
    const durationSelect = document.getElementById('duration-select');
    durationSelect.value = filters.duration;
  }

    // Add "Clear" button functionality for category filter
    const clearCategoryButton = document.querySelector('#category-select + div');
    if (clearCategoryButton) {
      clearCategoryButton.addEventListener('click', () => {
          filters.category = [];
          saveFiltersToLocalStorage(filters);
          generateFilterPillsAndUpdateDOM(filters);
        
      });
    }
}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
