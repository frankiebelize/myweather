document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const currentWeatherSection = document.getElementById('current-weather');
    const forecastSection = document.getElementById('forecast');
    const searchHistoryContainer = document.getElementById('search-history');


    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const cityName = cityInput.value.trim();

        if (cityName !== '') {
           
            getWeather(cityName);

           
            cityInput.value = '';
        }
    });


    function getWeather(city) {
        const apiKey = '3db172e8923cc96aa9dabbd765f57f3a';
        const geoCodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    

        fetch(geoCodingApiUrl)
            .then(response => response.json())
            .then(geoData => {

                if (geoData.cod === '404') {
                    console.error('City not found:', geoData.message);
                    return;
                }
    
                // Extract coordinates
                const { lat, lon } = geoData.coord;
    
                const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
                return fetch(weatherApiUrl);
            })
            .then(response => response.json())
            .then(data => {
                
                updateWeatherUI(data);
          
                saveToLocalStorage(city);
           
                updateSearchHistory();
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }
    


    function updateWeatherUI(data) {
        currentWeatherSection.innerHTML = '';
        forecastSection.innerHTML = '';


        const currentWeather = data.list[0].main;
        const currentWeatherHTML = `
            <h2>${data.city.name}</h2>
            <p>Date: ${new Date(data.list[0].dt * 1000).toLocaleDateString()}</p>
            <p>Temperature: ${currentWeather.temp} °C</p>
            <p>Humidity: ${currentWeather.humidity}%</p>
            <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>
        `;
        currentWeatherSection.innerHTML = currentWeatherHTML;


        for (let i = 1; i < data.list.length; i++) {
            const forecast = data.list[i].main;
            const forecastHTML = `
                <div class="forecast-item">
                    <p>Date: ${new Date(data.list[i].dt * 1000).toLocaleDateString()}</p>
                    <p>Temperature: ${forecast.temp} °C</p>
                    <p>Humidity: ${forecast.humidity}%</p>
                    <p>Wind Speed: ${data.list[i].wind.speed} m/s</p>
                </div>
            `;
            forecastSection.innerHTML += forecastHTML;
        }
    }

   
    function updateSearchHistory() {
        searchHistoryContainer.innerHTML = '';
        const searchHistory = getFromLocalStorage();

        searchHistory.forEach(city => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.textContent = city;

            historyItem.addEventListener('click', function () {
                
                getWeather(city);
            });

            searchHistoryContainer.appendChild(historyItem);
        });
    }
});
