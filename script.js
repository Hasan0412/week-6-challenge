function getWeather() {
  const apiKey = '3ef3feb61b9b45fe96e200638232606';

  const cityInput = document.getElementById('city');
  const city = cityInput.value;

  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const weatherCard = document.getElementById('weatherCard');

      if (data.error) {
        weatherCard.innerHTML = `<p>${data.error.message}</p>`;
      } else {
        const current = data.current;
        const forecast = data.forecast.forecastday.slice(1); // Exclude current day

        let weatherHTML = '<h2>Current Weather</h2>';

        weatherHTML += `
          <div class="forecast-card">
            <h3>${data.location.name}, ${data.location.country}</h3>
            <p><strong>Temperature:</strong> ${current.temp_c}°C</p>
            <p><strong>Condition:</strong> ${current.condition.text}</p>
            <p><strong>Humidity:</strong> ${current.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${current.wind_kph} km/h</p>
            <img src="https:${current.condition.icon}" alt="Weather Icon">
          </div>
        `;

        weatherHTML += '<h2>5-Day Forecast</h2>';

        forecast.forEach(day => {
          const date = day.date;
          const { avgtemp_c, condition, avghumidity, maxwind_kph } = day.day;

          weatherHTML += `
            <div class="forecast-card">
              <h3>${date}</h3>
              <p><strong>Average Temperature:</strong> ${avgtemp_c}°C</p>
              <p><strong>Condition:</strong> ${condition.text}</p>
              <p><strong>Average Humidity:</strong> ${avghumidity}%</p>
              <p><strong>Max Wind Speed:</strong> ${maxwind_kph} km/h</p>
              <img src="https:${condition.icon}" alt="Weather Icon">
            </div>
          `;
        });

        weatherCard.innerHTML = weatherHTML;
        saveToLocalStorage(city);
      }
    })
    .catch(error => {
      const weatherCard = document.getElementById('weatherCard');
      weatherCard.innerHTML = '<p>An error occurred while fetching the weather data.</p>';
    });
}

function saveToLocalStorage(city) {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.unshift(city);
  const uniqueHistory = [...new Set(searchHistory)].slice(0, 5);
  localStorage.setItem('searchHistory', JSON.stringify(uniqueHistory));
}
