import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {

  try {
    const resData = await fetch(`${config.backendEndpoint}reservations/`);

    if (!resData.ok) {
      throw new Error(`Failed to fetch reservations: ${resData.status}`);
    }
    const data = await resData.json();
    return data;
  } catch (error) {
    console.error("Error Fetching Reservations :", error);
    return null;
  }

}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {

  let noReservationBanner = document.getElementById("no-reservation-banner");
  let reservationTableParent = document.getElementById(
    "reservation-table-parent");

  if (reservations.length === 0) {
    noReservationBanner.style.display = "block";
    reservationTableParent.style.display = "none";
  } else {
    noReservationBanner.style.display = "none";
    reservationTableParent.style.display = "block";
  }

  let reservationTable = document.getElementById("reservation-table");

  reservationTable.innerHTML = "";

  reservations.forEach((reservation) => {
    let row = document.createElement("tr");

    let dateFormat = new Date(reservation.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    let formattedDate = new Date(reservation.time).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    let formattedTime = new Date(reservation.time).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
    let formattedDateTime = `${formattedDate}, ${formattedTime}`;

    row.innerHTML = `
        <td>${reservation.id}</td>
        <td>${reservation.name}</td>
        <td>${reservation.adventureName}</td>
        <td>${reservation.person}</td>
        <td>${dateFormat}</td>
        <td>${reservation.price}</td>
        <td>${formattedDateTime}</td>
        <td>
            <button type= "button" id="${reservation.id}" class="reservation-visit-button">
            <a href="../detail/?adventure=${reservation.adventure}">Visit Adventure</a>
            </button>
        </td>
      `;


    reservationTable.appendChild(row);
  });
}

export { fetchReservations, addReservationToTable };
