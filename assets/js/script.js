// create variables to connect info
var cities = [];

var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

// save search to local storage
var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

// form to enter a city
var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value ="";
    } else {
        // ensure a vity is added to form
        alert("Please enter valid city");
    }
    saveSearch();
    pastSearch(city);
}

// fetch weather data from api and create api key variable
var getCityWeather = function(city) {
    var apiKey = "524901&appid=51e858bcb3c9554aaabd869dfdb30a58";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl) 
    .then(function(response) {
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });

};

// fucntion to dispay pulled data
var displayWeather = function(weather, searchCity) {

    // show current date
    var currentDate = document.createElement("span")
    currentDate.textContent = "(" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    // show temputure data
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "temperature: " + weather.main.temp + "Farenhait";
    temperatureEl.classList = "list-group-item"

    // show humidity data
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"

    // show wind data
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "wind speed: " + weather.wind.speed + " mph";
    windSpeedEl.classList = "list-group-item"

    // append temp, wind, humidity ot container
    weatherContainerEl.appendChild(temperatureEl);
    weatherContainerEl.appendChild(humidityEl);
    weatherContainerEl.appendChild(windSpeedEl);

    // coordinates
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat,lon)
}

// uv index function
var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index is "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <= 2) {
        uvIndexValue.classList = "favorable"
    } else if(index.value > 2 && index.value <= 8){
        uvIndexValue.classList = "moderate "
    } else if(index.value > 8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    weatherContainerEl.appendChild(uvIndexEl);
}

// fetch data for 5 day forecast
var get5Day = function (city) {
    var apiKey = "524901&appid=51e858bcb3c9554aaabd869dfdb30a58";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(fucntion(data) {
            display5Day(data);
        });
    });
};

// TODO display data fro 5 day forecast

// TODO create function to show past searches. show in past search bar once submitting "city" in search bar

// create click and submit event handlers

