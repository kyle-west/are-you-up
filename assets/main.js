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

  notifyUserOfChanges(document.title, title, favicon, struggling);

  document.title = title;
  document.getElementById('title').innerHTML = title;
  document.getElementById('favicon').href = `./assets/images/${favicon}.png`;

}


// Test with to following calls:
//    notifyUserOfChanges('All Systems Reporting Positive', 'All Systems Reporting Positive', 'Up', [])
//    notifyUserOfChanges('All Systems Reporting Positive', 'Some Systems are Reporting Problems (GitHub)', 'down', ['GitHub'])
window.notifyUserOfChanges = (currentTitle, newTitle, favicon, struggling) => {
  if (currentTitle !== newTitle) {
    let message = newTitle;
    if (struggling.length) {
      let del = struggling.length > 1 ? "are" : "is";
      message = struggling.join(", ") + ` ${del} Reporting Problems`;
    }
    Notification.requestPermission().then((result) => {
      console.log("Permission to Notify:", result);
      if (result === 'granted') {
        window.lastNotification = new Notification(message, {
          icon: `https://kyle-west.github.io/are-you-up/assets/images/${favicon}.png`,
          image: `https://kyle-west.github.io/are-you-up/assets/images/${favicon}.png`
        });
      }
    });
  }
}