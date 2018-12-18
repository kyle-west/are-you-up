async function fetchAll () {
  let places = await fetch('./assets/places.json').then(r=>r.json());
  html = "";
  JSON.stringify(places);
  for (place in places) {
    html += `<status-card status-url="${places[place]['status-url']}" icon-url="${places[place]['icon-url']}"></status-card>`;
  }
  document.getElementById('statuses').innerHTML = html;
}

window.companyStatus = {}
window.notifyStatusChange = (company, newStatus, oldStatus) => {
  window.companyStatus[company] = newStatus;
  if (newStatus !== oldStatus) {
    console.log(company, newStatus, oldStatus);
    updateTitle();
  }
}

function updateTitle () {
  let struggling = [];
  for (company in companyStatus) {
    if (companyStatus[company] !== "none") {
      struggling.push(company);
    }
  }

  let title = "All Systems Reporting Positive";
  let favicon = "up"; 
  if (struggling.length) {
    title = "Some Systems are Reporting Problems (" + struggling.join(" | ") + ")";
    favicon = "down";
  }
  document.title = title;
  document.getElementById('title').innerHTML = title;
  document.getElementById('favicon').href = `./assets/images/${favicon}.png`;
}