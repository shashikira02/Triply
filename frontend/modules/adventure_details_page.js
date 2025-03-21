import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  
  let params = new URLSearchParams(search);
  let adventureId = params.get('adventure');
  // console.log(adventure);
  return adventureId;


}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {

    try{
      const resData = await fetch(`${config.backendEndpoint}adventures/detail/?adventure=${adventureId}`);

      if(!resData.ok){
        throw new Error(`Failed to Fetch Adventure Details : ${resData.status}`);
      }

      const data = await resData.json();
      return data;
    }
    catch(error){
      console.error("Error fetching Adventure Details :", error);
      return null;
    }

}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  const {name, subtitle, images, content  } = adventure;
  
  const adventureNameElement = document.getElementById('adventure-name');
  const adventureSubtitleElement = document.getElementById('adventure-subtitle');
  const adventureContentElement = document.getElementById('adventure-content');
  const photoGalleryElement = document.getElementById('photo-gallery');

  adventureNameElement.textContent = name;
  adventureSubtitleElement.textContent = subtitle;
  adventureContentElement.innerHTML = content;
  photoGalleryElement.innerHTML = '';


  images.forEach(image => {
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('activity-card-image');

    imageDiv.innerHTML = 
    `
      <img src="${image}" alt = "${name}" class="img-fluid"  />
    `;
    photoGalleryElement.appendChild(imageDiv);
  })

}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {

  const photoGalleryElement = document.getElementById('photo-gallery');

  photoGalleryElement.innerHTML ='';

  const carouselHTML = `
    <div id="photo-gallery-carousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        ${images.map((_, index) => `
          <button type="button" data-bs-target="#photo-gallery-carousel" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}" aria-label="Slide ${index + 1}"></button>
        `).join('')}
      </div>
      <div class="carousel-inner">
        ${images.map((imageUrl, index) => `
          <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="activity-card-image">
              <img src="${imageUrl}" class="d-block w-100" alt="Adventure Image">
            </div>
          </div>
        `).join('')}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#photo-gallery-carousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#photo-gallery-carousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
  `;
  photoGalleryElement.innerHTML = carouselHTML;

}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {

  const soldOutPanel = document.getElementById('reservation-panel-sold-out');

  const availablePanel = document.getElementById('reservation-panel-available');

  const costPerHead = document.getElementById('reservation-person-cost');

  if(adventure.available){
    soldOutPanel.style.display = "none";
    availablePanel.style.display = 'block';

    if (costPerHead) {
      costPerHead.textContent = adventure.costPerHead;
    }

  } else{

    soldOutPanel.style.display = 'block';
    availablePanel.style.display = 'none';
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  const totalCost = adventure.costPerHead*persons;

  const reservationCostElement = document.getElementById('reservation-cost');

  if(reservationCostElement)reservationCostElement.innerHTML = totalCost;

}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {

  const form = document.getElementById('myForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');
    const date = formData.get('date');
    const person = formData.get('person');

    const reservationData = {
      name, date, person, adventure: adventure.id,
    };

    try{
      const response = await fetch(`${config.backendEndpoint}reservations/new`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      if(response.ok){
        alert('Success!');
        window.location.reload();
      }
      else{
        let data = await reservationData.json();
      alert(`Failed! - ${data.message}`);
      }

    }catch(error){
      console.log('Error making reservation:' , error);
      alert('Failed!');
    }
  });
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  const reservedBanner = document.getElementById('reserved-banner');

  if(adventure.reserved){
    reservedBanner.style.display = 'block';
  }
  else{
    reservedBanner.style.display = 'none';
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
