let cityInput = document.querySelector("#city-input");
let searchForm = document.querySelector("#search-form");
let locationBtn = document.querySelector("#location-btn");
let date = document.querySelector("#date");
let apiKey = "50c2acd53349fabd54f52b93c8650d37";

let currentDate = new Date();
let days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

date.innerHTML = `${days[currentDate.getDay() - 1]} ${currentDate.getHours().toString().padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

let celsiusLink = document.querySelector("#celsius-link");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let temperature = document.querySelector("#temperature");

function showFahrenheit() {
  let celsius = parseFloat(temperature.innerHTML);
  let fahrenheit = (celsius * 9) / 5 + 32;
  temperature.innerHTML = fahrenheit;
  celsiusLink.classList.remove("text-primary");
  fahrenheitLink.classList.add("text-primary");
}

function showCelsius() {
  let fahrenheit = parseFloat(temperature.innerHTML);
  let celsius = ((fahrenheit - 32) * 5) / 9;
  temperature.innerHTML = celsius;
  celsiusLink.classList.add("text-primary");
  fahrenheitLink.classList.remove("text-primary");
}

celsiusLink.addEventListener("click", showCelsius);
fahrenheitLink.addEventListener("click", showFahrenheit);

function setIcon(response) {
    let icon = document.querySelector("#icon");
    let iconMap = {
      "clear sky": "src/img/clear-sky.png",
      "few clouds": "src/img/few-clouds.png",
      "scattered clouds": "src/img/scattered-clouds.png",
      "broken clouds": "src/img/scattered-clouds.png",
      "overcast clouds": "src/img/scattered-clouds.png",
      "shower rain": "src/img/shower-rain.png",
      "rain": "src/img/rain.png",
      "light rain": "src/img/rain.png",
      "drizzle": "src/img/rain.png",
      "thunderstorm": "src/img/thunderstorm.png",
      "snow": "src/img/snow.png",
      "mist": "src/img/mist.png",
    };
    let description = response.data.weather[0].description;
    let iconSrc = iconMap[description];
    icon.setAttribute("src", iconSrc);
}

function displayTemp(response) {
  console.log(response.data);
  let currentTemp = Math.round(response.data.main.temp);
  let city = document.querySelector("#city");
  let cityDescription = document.querySelector("#description");
  let cityHumidity = document.querySelector("#humidity");
  let cityWind = document.querySelector("#wind");
  city.innerHTML = response.data.name;
  cityDescription.innerHTML = response.data.weather[0].description;
  temperature.innerHTML = currentTemp;
  cityHumidity.innerHTML = response.data.main.humidity;
  cityWind.innerHTML = response.data.wind.speed;
  setIcon(response);
}

function searchCity(e) {
  e.preventDefault();
  let city = cityInput.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemp);
}

function displayWeather(location) {
  console.log(location);
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemp);
}

searchForm.addEventListener("submit", searchCity);

locationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(displayWeather);
});
