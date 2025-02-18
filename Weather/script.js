const cityInput = document.querySelector(".city-input")
const searchBtn =  document.querySelector(".search-btn")

const weatherInfoSection =  document.querySelector(".maincontents")
const searchCitySection =  document.querySelector(".search-city")
const notFoundSection =  document.querySelector(".not-found")

const countryTxt =  document.querySelector(".country-txt")
const tempTxt =  document.querySelector(".temp-text")
const conditionTxt =  document.querySelector(".condition-txt")
const humidityValueTxt =  document.querySelector(".humidity-value")
const windValueTxt =  document.querySelector(".wind-value")
const visibleValueTxt =  document.querySelector(".visible-value")
const tempValueTxt =  document.querySelector(".temp-value")
const weatherSummaryImg =  document.querySelector(".weather-summary-img")
const currentDayTxt =  document.querySelector(".current-day")
const currentDateTxt =  document.querySelector(".current-date")
const feelsLikeTxt =  document.querySelector(".feels-like")
const sunriseTxt =  document.querySelector(".sunrise-timing")
const sunsetTxt =  document.querySelector(".sunset-timing")


const forecastItemsContainer = document.querySelector(".forecast-items-container")



const apiKey = '21d28f8e9b8bb9d49545e95b40dfac7f'

searchBtn.addEventListener('click', ()=>{
    if (cityInput.value.trim() != ''){
        updateWeatherinfo(cityInput.value)
        cityInput.value = ""
    }
})

cityInput.addEventListener('keydown', (event) =>{
    if (event.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherinfo(cityInput.value)
        cityInput.value = ''
    }
})

async function getFetchData(endpoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getWeatherIcon(id){
    if (id <= 232) return 'thunderstrom.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}


function getCurrentDay(){
    const currentDate = new Date()
    
    const options = {
        weekday: 'long'
    }

    return currentDate.toLocaleDateString('en-GB', options)
}

function getCurrentDate(){
    const currentDate = new Date()
    
    const options = {
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
}


async function updateWeatherinfo(city) {
    const weatherData = await getFetchData('weather', city)

    if (weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)

    const {
        name: country,
        main: {temp, humidity, feels_like, temp_max},
        sys: {sunrise, sunset},
        weather: [{id, main}],
        wind: {speed},
        visibility: visible
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity
    windValueTxt.textContent = speed
    visibleValueTxt.textContent = Math.round(visible/1000)
    tempValueTxt.textContent = Math.round(temp_max)
    feelsLikeTxt.textContent = "Feels Like " + Math.round(feels_like) + '°C'
    sunriseTxt.textContent = new Date(sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    sunsetTxt.textContent = new Date(sunset * 1000).toLocaleTimeString([], {hour: '2-digit',minute: '2-digit'});



    currentDayTxt.textContent = getCurrentDay()
    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    

    await updateForecastInfo(city)

    showDisplaySection(weatherInfoSection)
}

// function formatTime(timestamp) {
//     const date = new Date(timestamp * 1000); // Convert to milliseconds
//     return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
//     x}

async function updateForecastInfo(city) {
    const forecastsData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]


    forecastItemsContainer.innerHTML = ``
    forecastsData.list.forEach(forecastWeather =>{
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather)
        }
    })
}


function updateForecastItems(weatherData) {
    const {
        dt_txt : date,
        weather: [{id}],
        main: {temp}

    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-items">
            <h5 class="forecast-item-date">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img" alt="">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}


function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => {
        section.style.display = 'none';
    });

    section.style.display = 'flex';

}
