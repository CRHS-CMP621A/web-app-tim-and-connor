document.addEventListener('DOMContentLoaded', () => {
  const sourceTimezoneInput = document.getElementById('source-timezone');
  const targetTimezoneInput = document.getElementById('target-timezone');
  const convertButton = document.getElementById('convert-button');
  const sourceAutocompleteContainer = document.getElementById('autocomplete-container-source');
  const targetAutocompleteContainer = document.getElementById('autocomplete-container-target');

  let timezones = [];

  convertButton.addEventListener('click', handleTimezoneConversion);
  sourceTimezoneInput.addEventListener('focus', () => {
    handleAutocomplete(sourceTimezoneInput, sourceAutocompleteContainer);
  });
  targetTimezoneInput.addEventListener('focus', () => {
    handleAutocomplete(targetTimezoneInput, targetAutocompleteContainer);
  });

  sourceTimezoneInput.addEventListener('input', () => {
    handleAutocomplete(sourceTimezoneInput, sourceAutocompleteContainer);
  });

  targetTimezoneInput.addEventListener('input', () => {
    handleAutocomplete(targetTimezoneInput, targetAutocompleteContainer);
  });

  function handleTimezoneConversion() {
    const sourceTimezone = sourceTimezoneInput.value;
    const targetTimezone = targetTimezoneInput.value;

    if (!sourceTimezone || !targetTimezone) {
      alert('Please select source and target timezones.');
      return;
    }

    const apiKey = 'XWRY3TX1YVTA';

    const apiUrl = `https://api.timezonedb.com/v2.1/convert-time-zone?key=${apiKey}&format=json&from=${sourceTimezone}&to=${targetTimezone}&time=${Date.now() / 1000}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('API request failed');
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 'OK') {
          const convertedTime = new Date(data.toTimestamp * 1000).toLocaleTimeString('en-US');
          displayConvertedTime(convertedTime);
        } else {
          throw new Error(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        displayConvertedTime('Unknown');
      });
  }

  function displayConvertedTime(convertedTime) {
    const convertedTimeElement = document.getElementById('converted-time');
    convertedTimeElement.textContent = `Converted Time: ${convertedTime}`;
  }

  function handleAutocomplete(inputElement, autocompleteContainer) {
    const inputText = inputElement.value.trim().toLowerCase();
    const matchedOptions = timezones.filter(option => option.toLowerCase().startsWith(inputText));
    displayAutocompleteOptions(matchedOptions, autocompleteContainer, inputElement);
  }

  function displayAutocompleteOptions(options, autocompleteContainer, inputElement) {
    autocompleteContainer.innerHTML = '';

    if (options.length === 0) {
      autocompleteContainer.style.display = 'none';
      return;
    }

    options.forEach(option => {
      const optionElement = document.createElement('div');
      optionElement.textContent = option;
      optionElement.classList.add('autocomplete-option');
      optionElement.addEventListener('click', () => {
        inputElement.value = option;
        autocompleteContainer.style.display = 'none';
      });
      autocompleteContainer.appendChild(optionElement);
    });

    autocompleteContainer.style.display = 'block';
  }

  fetch('https://worldtimeapi.org/api/timezone')
    .then(response => response.json())
    .then(data => {
      timezones = data.map(zone => zone.split('/').pop());
    })
    .catch(error => console.error('Error:', error));
});
