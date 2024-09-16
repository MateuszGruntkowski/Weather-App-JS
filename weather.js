import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { geolocationFetch } from './data/geolocation-data.js';
import { weatherDataFetch } from './data/weather-data.js';

// Define a variable to store the search value
const inputElement = document.querySelector('.js-change-location-input');
const searchButton = document.querySelector('.js-search-button');
const leftPanelBackground = document.querySelector('.js-left-panel');
let search = inputElement.value;


inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        removeClasses()
        handleSearch()
    }
});

searchButton.addEventListener('click', async ()=>{
    removeClasses()
    handleSearch();
})

async function handleSearch() {
    search = inputElement.value;
    console.log('Search Value:', search);

    try {
        const geolocationData = await geolocationFetch(search);
        const latitude = geolocationData.latitude;
        const longitude = geolocationData.longitude;

        const weatherData = await weatherDataFetch(latitude, longitude);
        setDateInfo(geolocationData);
        setWeatherData(weatherData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
}

function setDateInfo(data){
    const dayLabel = dayjs().format('dddd');
    document.querySelector('.js-day-label').innerHTML = dayLabel;

    const dateLabel = dayjs().format('D MMM YYYY');
    document.querySelector('.js-date-label').innerHTML = dateLabel;

    if(data){
        const city = data.name;
        const countryCode = data.country_code;
        const locationLabel = `${city}, ${countryCode}`;
        document.querySelector('.js-location-label').innerHTML = locationLabel;
    }else{
        document.querySelector('.js-location-label').innerHTML = 'Chodziez, PL';
    }
}

function setWeatherData(weatherData){

    document.querySelector('.js-weather-info-container').innerHTML = 
        `
            <div class="info-row">
                <span class="label">PRECIPITATION</span>
                <span class="value">${weatherData.dayZeroData.precipitation_probability}%</span>
            </div>
            <div class="info-row">
                <span class="label">HUMIDITY</span>
                <span class="value">${weatherData.dayZeroData.relative_humidity_2m}%</span>
            </div>
            <div class="info-row">
                <span class="label">WIND</span>
                <span class="value">${weatherData.dayZeroData.wind_speed_10m} km/h</span>
            </div>
        `;

    const today = dayjs();

    const day0 = today.format('ddd')
    const day1 = today.add(1, 'day').format('ddd');
    const day2 = today.add(2, 'day').format('ddd');
    const day3 = today.add(3, 'day').format('ddd');

    let weatherInfo = getIconsAndDescription(weatherData);
    let weatherIcons = weatherInfo[0];
    let weatherDescriptions = weatherInfo[1];
    let weatherClasses = weatherInfo[2];

    document.querySelector('.js-forecast-container').innerHTML = 
        `
            <div class="forecast-card selected">
                ${weatherIcons[0]}
                <div class="day">${day0}</div>
                <div class="temp">${weatherData.dayZeroData.temperature_2m}</div>
            </div>
            <div class="forecast-card">
                ${weatherIcons[1]}
                <div class="day">${day1}</div>
                <div class="temp">${weatherData.dayOneData.temperature_2m_max}</div>
            </div>
            <div class="forecast-card">
                ${weatherIcons[2]}
                <div class="day">${day2}</div>
                <div class="temp">${weatherData.dayTwoData.temperature_2m_max}</div>
            </div>
            <div class="forecast-card">
                ${weatherIcons[3]}
                <div class="day">${day3}</div>
                <div class="temp">${weatherData.dayThreeData.temperature_2m_max}</div>
            </div>
        `;

    weatherIcons[0] = weatherIcons[0].slice(0, -6) + " weather-desc-icon" + weatherIcons[0].slice(-6);
    document.querySelector('.js-weather-desc-container').innerHTML =
        `
            ${weatherIcons[0]}
            <div class="weather-desc-temp">${weatherData.dayZeroData.temperature_2m}</div>
            <div class="weather-desc">${weatherDescriptions[0]}</div>
        `

    
    leftPanelBackground.classList.add(weatherClasses[0]);
        
}

function getIconsAndDescription(weatherData){

    const weatherIcons = [];
    const weatherDescriptions = [];
    const weatherClasses = [];
    const result = [];

    for(let day in weatherData){
        switch(weatherData[day].weather_code){
            case 0: 
                weatherIcons.push('<i class="fa-solid fa-sun"></i>');
                weatherDescriptions.push('Sunny')
                weatherClasses.push('left-panel-sun');
                break;
            case 1:
            case 2:
            case 3:
                weatherIcons.push('<i class="fa-solid fa-cloud-sun"></i>');
                weatherDescriptions.push('Mainly clear')
                weatherClasses.push('left-panel-mainly-clear');
                break;
            case 45:
            case 48:
                weatherIcons.push('<i class="fa-solid fa-cloud"></i>');
                weatherDescriptions.push('Cloudy')
                weatherClasses.push('left-panel-cloudy');
                break;
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
            case 80:
            case 81:
            case 82:
                weatherIcons.push('<i class="fa-solid fa-cloud-rain"></i>');
                weatherDescriptions.push('Rainy');
                weatherClasses.push('left-panel-rainy');
                break;
            case 71:
            case 73:
            case 75:
            case 77:
            case 85:
            case 86:
                weatherIcons.push('<i class="fa-solid fa-snowflake"></i>');
                weatherDescriptions.push('Snow');
                weatherClasses.push('left-panel-snow');
                break;
            case 95:
            case 96:
            case 99:
                weatherIcons.push('<i class="fa-solid fa-cloud-bolt"></i>');
                weatherDescriptions.push('Thunderstorm');
                weatherClasses.push('left-panel-thunderstorm');
                break;
            
        }
    }
    result.push(weatherIcons, weatherDescriptions, weatherClasses);
    return result;
}

function removeClasses(){
    const weatherClasses = ['left-panel-thunderstorm', 'left-panel-snow', 'left-panel-rainy', 'left-panel-cloudy', 'left-panel-mainly-clear', 'left-panel-sun'];
    weatherClasses.forEach((weatherClass) => {
        leftPanelBackground.classList.remove(weatherClass);
    });
}