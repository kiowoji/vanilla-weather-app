let cityInput = document.querySelector("#city-input");
let searchForm = document.querySelector("#search-form");
let locationBtn = document.querySelector("#location-btn");
let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";

let iconMap = {
  Clear: "src/img/clear-sky.png",
  Clouds: "src/img/clouds.png",
  Rain: "src/img/light-rain.png",
  Drizzle: "src/img/rain.png",
  Thunderstorm: "src/img/thunderstorm.png",
  Snow: "src/img/snow.png",
  Mist: "src/img/mist.png",
};

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function setIcon(response) {
  let icon = document.querySelector("#icon");
  let description = response.data.weather[0].main;
  let iconSrc = iconMap[description];
  icon.setAttribute("src", iconSrc);
}

function getIcon(main) {
  return iconMap[main];
}

function displayTemp(response) {
  console.log(response.data);
  let currentTemp = Math.round(response.data.main.temp);
  let date = document.querySelector("#date");
  let city = document.querySelector("#city");
  let cityDescription = document.querySelector("#description");
  let cityHumidity = document.querySelector("#humidity");
  let cityWind = document.querySelector("#wind");
  date.innerHTML = formatDate(response.data.dt * 1000);
  city.innerHTML = response.data.name;
  cityDescription.innerHTML = response.data.weather[0].description;
  temperature.innerHTML = currentTemp;
  cityHumidity.innerHTML = response.data.main.humidity;
  cityWind.innerHTML = response.data.wind.speed;
  setIcon(response);
  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemp);
}

function displayLocation(location) {
  console.log(location);
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemp);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(forecast);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      let icon = getIcon(forecastDay.weather[0].main);
      forecastHTML += `
        <div
          class="card text-center border border-white border-3 rounded-4 col-lg col-md-3 col-sm-4"
        >
          <div class="card-body m-2">
            <h5 id="forecast-day" class="card-title">${formatDay(
              forecastDay.dt
            )}</h5>
            <img
              id="forecast-icon"
              class="card-img"
              src=${icon}
              alt="Card image cap"
            />
            <div class="row">
              <div class="col">
                <p id="forecast-temp-max" class="card-text mt-2 fw-bold">
                  ${Math.round(forecastDay.temp.max)}°
                </p>
              </div>
              <div class="col">
                <p
                  id="forecast-temp-min"
                  class="card-text mt-2 fw-bold text-secondary"
                >
                  ${Math.round(forecastDay.temp.min)}°
                </p>
              </div>
            </div>
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  searchCity(cityInput.value);
}

function showFahrenheit() {
  if (selectedUnit === "fahrenheit") {
    return;
  }

  let celsius = parseInt(temperature.innerHTML);
  let fahrenheit = (celsius * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheit);
  selectedUnit = "fahrenheit";
  celsiusLink.classList.remove("text-primary");
  fahrenheitLink.classList.add("text-primary");
}

function showCelsius() {
  if (selectedUnit === "celsius") {
    return;
  }

  let fahrenheit = parseInt(temperature.innerHTML);
  let celsius = ((fahrenheit - 32) * 5) / 9;
  temperature.innerHTML = Math.round(celsius);
  selectedUnit = "celsius";
  fahrenheitLink.classList.remove("text-primary");
  celsiusLink.classList.add("text-primary");
}

let celsiusLink = document.querySelector("#celsius-link");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let temperature = document.querySelector("#temperature");
let selectedUnit = "celsius";

celsiusLink.addEventListener("click", showCelsius);
fahrenheitLink.addEventListener("click", showFahrenheit);

searchForm.addEventListener("submit", handleSubmit);
searchCity("Paris");
locationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(displayLocation);
});
