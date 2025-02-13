const apiKey = '80c3551c9c287c8709096afccdbcd917'; // Replace with your OpenWeather API key
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const hourlyBaseUrl = 'https://api.openweathermap.org/data/2.5/onecall';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const weatherType = document.getElementById('weatherType');
const hourlyForecastContainer = document.getElementById('forecastContainer');
const toggleModeButton = document.getElementById('toggleMode');
const loadingIndicator = document.getElementById('loading');
const feelsLike = document.getElementById('Feels_like');
const humidity = document.getElementById('humidity');
const seaLevel = document.getElementById('sea_level');

// Fetch the weather data for the entered city
async function fetchWeather(city) {
  const weatherUrl = `${apiBaseUrl}?q=${city}&appid=${apiKey}&units=metric`;

  try {
    loadingIndicator.classList.add('active');
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    loadingIndicator.classList.remove('active');
    
    if (weatherData.cod !== 200) {
      alert('City not found!');
      return;
    }
    
    // Display weather info
    cityName.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    temperature.textContent = `${weatherData.main.temp}°C`;
    weatherType.textContent = weatherData.weather[0].description;
    feelsLike.textContent = `Feels Like: ${weatherData.main.feels_like}°C`;
    humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
    seaLevel.textContent = `Sea Level: ${weatherData.main.sea_level} hPa`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
    const lat = weatherData.coord.lat;
    const lon = weatherData.coord.lon;

    // Fetch hourly forecast
    fetchHourlyForecast(weatherData.coord.lat, weatherData.coord.lon);
  } catch (error) {
    loadingIndicator.classList.remove('active');
    console.error('Error fetching weather data:', error);
  }
}

// Fetch hourly forecast for the next 24 hours
async function fetchHourlyForecast(lat, lon) {
  const hourlyUrl = `${hourlyBaseUrl}?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}&units=metric`;

  try {
    const hourlyResponse = await fetch(hourlyUrl);
    const hourlyData = await hourlyResponse.json();
    
    // Clear previous forecast data
    hourlyForecastContainer.innerHTML = '';
    
    // Display hourly weather
    hourlyData.hourly.slice(0, 6).forEach((hour, index) => {
      const hourElement = document.createElement('div');
      hourElement.classList.add('forecast-item');
      const hourTime = new Date(hour.dt * 1000).getHours();
      hourElement.innerHTML = `
        <h4>${hourTime}:00</h4>
        <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="${hour.weather[0].description}">
        <p>${hour.temp}°C</p>
      `;
      hourlyForecastContainer.appendChild(hourElement);
    });
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
  }
}

// Event listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value;
  if (city) {
    fetchWeather(city);
  } else {
    alert('Please enter a city name');
  }
});
