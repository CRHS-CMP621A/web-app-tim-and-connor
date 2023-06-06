let myTimezone;
let otherTimezone;
let convertedDateTime;

// Function to populate the time zone select elements
function populateTimezones() {
  let selectElements = document.querySelectorAll("select");
  let timeZones = moment.tz.names();

  timeZones.forEach(function(timezone) {
    let option = document.createElement("option");
    option.value = timezone;
    option.text = timezone;

    selectElements.forEach(function(select) {
      select.appendChild(option.cloneNode(true));
    });
  });
}

// Function to convert time between time zones
function convertTime() {
  let url = 'https://api.timezonedb.com/v2.1/convert-time-zone';
  let apiKey = 'XWRY3TX1YVTA';

  let xhr = new XMLHttpRequest();
  xhr.open('GET', `${url}?from=${encodeURIComponent(myTimezone)}&to=${encodeURIComponent(otherTimezone)}&time=${Math.floor(Date.now() / 1000)}&key=${encodeURIComponent(apiKey)}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let response = xhr.responseXML;
        let convertedTime = response.getElementsByTagName('toTimestamp')[0].textContent;
        console.log(convertedTime)

        let options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZone: otherTimezone
        };

        convertedDateTime = new Date(convertedTime * 1000).toLocaleString(undefined, options);
        updateResult();
      } else {
        let errorMessage = "Error: " + xhr.status + " " + xhr.statusText;
        displayError(errorMessage);
      }
    }
  };

  xhr.send();
}

// Function to update the conversion result
function updateResult() {
  let resultElement = document.getElementById("result");
  resultElement.textContent = "Converted Time: " + convertedDateTime;
}

// Function to display error message
function displayError(errorMessage) {
  let resultElement = document.getElementById("result");
  resultElement.textContent = errorMessage;
}

// Event listener for the confirm button
document.getElementById("confirmButton").addEventListener("click", function() {
  myTimezone = document.getElementById("myTimezone").value;
  otherTimezone = document.getElementById("otherTimezone").value;

  convertTime();
});

// Call the populateTimezones function on page load
document.addEventListener("DOMContentLoaded", function() {
  populateTimezones();
});