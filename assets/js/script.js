// create variables to connect info
var cities = [];

var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

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

// save search to local storage
var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

// fetch weather data from api and create api key variable
var getCityWeather = function(city) {
    var apiKey = "51e858bcb3c9554aaabd869dfdb30a58";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL).then(function(response) {
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });

};

// fucntion to dispay pulled data
var displayWeather = function(weather, searchCity) {

    // need to clear old searches to make room for new
    weatherContainerEl.textContent = " ";
    citySearchInputEl.textContent = searchCity;
    //console.log(weather);

    // show current date
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    // show temputure data
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

    // show humidity data
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "humidity: " + weather.main.humidity + "%";
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


// get uv index function

var getUvIndex = function(lat,lon) {
    var apiKey = "51e858bcb3c9554aaabd869dfdb30a58";
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
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
        uvIndexValue.classList = "moderate"
    } else if(index.value > 8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    weatherContainerEl.appendChild(uvIndexEl);
}

// fetch data for 5 day forecast
var get5Day = function(city) {
    var apiKey = "51e858bcb3c9554aaabd869dfdb30a58";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            display5Day(data);
        });
    });
};

// display results for 5 day forecast
var display5Day = function(weather) {
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "Your 5 Day Forecast";

    var forecast = weather.list;
    for (var i=5; i < forecast.length; i=i+8){
    var dailyForecast = forecast[i];
        
    var forecastEl=document.createElement("div");
    forecastEl.classList = "card bg-secondary text-light m-2";

       

    // date element
    var forecastDate = document.createElement("h5")
    forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");       
    forecastDate.classList = "card-header text-center bg-primary"
    forecastEl.appendChild(forecastDate);
 
       
    // temperture element
    var forecastTempEl=document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = "temp: " + dailyForecast.main.temp + " °F";
        
    forecastEl.appendChild(forecastTempEl);
    
    // humidity element
    var forecastHumEl=document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = "humidity: " + dailyForecast.main.humidity + "%";

    forecastEl.appendChild(forecastHumEl);

    // wind speed
    var forecastWindEl = document.createElement("span");
    forecastWindEl.classList = "card-body text-center";
    forecastWindEl.textContent = "wind speed: " + dailyForecast.wind.speed + " MPH";

    forecastEl.appendChild(forecastWindEl);



    forecastContainerEl.appendChild(forecastEl);
    }

}


// save searches in past search bar
var pastSearch = function(pastSearch){

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
}

// when "past searches" are clicked on, show data for that city

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city) {
        getCityWeather(city);
        get5Day(city);
    }
}


cityFormEl.addEventListener("submit", formSubmitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);