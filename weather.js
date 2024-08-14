import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

// Define a variable to store the search value
const inputElement = document.querySelector('.js-change-location-input');
let search = inputElement.value;

inputElement.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        // Update the search value when Enter is pressed
        search = inputElement.value;
        console.log('Search Value:', search);

        // Call the fetch function to get the location data
        const geolocationData = await geolocationFetch();
        const latitude = geolocationData.latitude;
        const longitude = geolocationData.longitude;

        const weatherData = await weatherDataFetch(latitude, longitude);
        

        setDataInfo(geolocationData);
        setWeatherData(weatherData);
        
    }
});

async function geolocationFetch() {
    // Build the URL inside the function to ensure it uses the updated search value
    const locationURL = `https://geocoding-api.open-meteo.com/v1/search?name=${search}&count=10&language=en&format=json`;

    try {
        const response = await fetch(locationURL);
        const responseJson = await response.json();
        const data = responseJson.results[0];

        return data;
    } catch (error) {
        console.log('Error fetching location data:', error);
    }
}

async function weatherDataFetch(latitude, longitude){
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,precipitation_probability_max,wind_speed_10m_max&timezone=Europe%2FBerlin`;
    try{
        const response = await fetch(weatherURL);
        const responseJSON = await response.json();

        const hourlyTime = responseJSON.hourly.time;
        const today = dayjs();


        const day0 = today.format('YYYY-MM-DDTHH:00')
        const day1 = today.add(1, 'day').format('YYYY-MM-DDTHH:00')
        const day2 = today.add(2, 'day').format('YYYY-MM-DDTHH:00')
        const day3 = today.add(3, 'day').format('YYYY-MM-DDTHH:00')
        
        let weatherData = {
            dayZeroData: {},
            dayOneData: {},
            dayTwoData: {},
            dayThreeData: {},
        };

        for(let i = 0; i <= hourlyTime.length-1; i++){
            if(day0 === hourlyTime[i]){
                weatherData.dayZeroData = {
                    temperature_2m: responseJSON.hourly.temperature_2m[i],
                    precipitation_probability: responseJSON.hourly.precipitation_probability[i],
                    relative_humidity_2m: responseJSON.hourly.relative_humidity_2m[i],
                    wind_speed_10m: responseJSON.hourly.wind_speed_10m[i],
                    weather_code: responseJSON.hourly.weather_code[i],
                };
            }else if (day1 === hourlyTime[i]){
                weatherData.dayOneData = {
                    temperature_2m: responseJSON.hourly.temperature_2m[i],
                    precipitation_probability: responseJSON.hourly.precipitation_probability[i],
                    relative_humidity_2m: responseJSON.hourly.relative_humidity_2m[i],
                    wind_speed_10m: responseJSON.hourly.wind_speed_10m[i],
                    weather_code: responseJSON.hourly.weather_code[i],
                };
            }else if(day2 === hourlyTime[i]){
                weatherData.dayTwoData = {
                    temperature_2m: responseJSON.hourly.temperature_2m[i],
                    precipitation_probability: responseJSON.hourly.precipitation_probability[i],
                    relative_humidity_2m: responseJSON.hourly.relative_humidity_2m[i],
                    wind_speed_10m: responseJSON.hourly.wind_speed_10m[i],
                    weather_code: responseJSON.hourly.weather_code[i],
                };
            }else if(day3 === hourlyTime[i]){
                weatherData.dayThreeData = {
                    temperature_2m: responseJSON.hourly.temperature_2m[i],
                    precipitation_probability: responseJSON.hourly.precipitation_probability[i],
                    relative_humidity_2m: responseJSON.hourly.relative_humidity_2m[i],
                    wind_speed_10m: responseJSON.hourly.wind_speed_10m[i],
                    weather_code: responseJSON.hourly.weather_code[i],
                };
            }
        }

        
        console.log(weatherData);
        return weatherData;
    }catch(error){
        console.log('Error fetching weather data: ', error)
    }
}

function setDataInfo(data){
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

    let icons = getIcons(weatherData);

    document.querySelector('.js-forecast-container').innerHTML = 
        `
            <div class="forecast-card selected">
                ${icons[0]}
                <div class="day">${day0}</div>
                <div class="temp">${weatherData.dayZeroData.temperature_2m}</div>
            </div>
            <div class="forecast-card">
                ${icons[1]}
                <div class="day">${day1}</div>
                <div class="temp">${weatherData.dayOneData.temperature_2m}</div>
            </div>
            <div class="forecast-card">
                ${icons[2]}
                <div class="day">${day2}</div>
                <div class="temp">${weatherData.dayTwoData.temperature_2m}</div>
            </div>
            <div class="forecast-card">
                ${icons[3]}
                <div class="day">${day3}</div>
                <div class="temp">${weatherData.dayThreeData.temperature_2m}</div>
            </div>
        `
}

function getIcons(weatherData){

    let icons = [];

    for(let day in weatherData){
        switch(weatherData[day].weather_code){
            case 0: 
                icons.push('<i class="fa-solid fa-sun"></i>');
                break;
            case 1:
            case 2:
            case 3:
                icons.push('<i class="fa-solid fa-cloud-sun"></i>');
                break;
            case 45:
            case 48:
                icons.push('<i class="fa-solid fa-cloud"></i>');
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
                icons.push('<i class="fa-solid fa-cloud-rain"></i>');
                break;
            case 71:
            case 73:
            case 75:
            case 77:
            case 85:
            case 86:
                icons.push('<i class="fa-solid fa-snowflake"></i>');
                break;
            case 95:
            case 96:
            case 99:
                icons.push('<i class="fa-solid fa-cloud-bolt"></i>');
                break;
            
        }
    }
    console.log(icons);
    return icons;

}

function dailyWeatherFetch(){

}