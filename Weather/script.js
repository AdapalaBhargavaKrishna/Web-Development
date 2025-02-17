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
const weatherSummaryImg =  document.querySelector(".weather-summary-img")
const currentDateTxt =  document.querySelector(".current-date")



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


function getCurrentDate(){
    const currentDate = new Date()
    
    const options = {
        weekday: 'short',
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
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity
    windValueTxt.textContent = speed

    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    
    













    showDisplaySection(weatherInfoSection)
}


function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => {
        section.style.display = 'none';
    });

    section.style.display = 'flex';

}