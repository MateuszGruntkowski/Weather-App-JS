import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
export async function weatherDataFetch(latitude, longitude){
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,precipitation_probability_max,wind_speed_10m_max&timezone=Europe%2FBerlin`;
    try{
        const response = await fetch(weatherURL);
        const responseJSON = await response.json();

        const hourlyTime = responseJSON.hourly.time;
        const today = dayjs();


        const day0 = today.format('YYYY-MM-DDTHH:00')
                
        let weatherData = {
            dayZeroData: {},
            dayOneData: {
                temperature_2m_max: responseJSON.daily.temperature_2m_max[1],
                precipitation_probability_max: responseJSON.daily.precipitation_probability_max[1],
                wind_speed_10m_max: responseJSON.daily.wind_speed_10m_max[1],
                weather_code: responseJSON.daily.weather_code[1]
            },
            dayTwoData: {
                temperature_2m_max: responseJSON.daily.temperature_2m_max[2],
                precipitation_probability_max: responseJSON.daily.precipitation_probability_max[2],
                wind_speed_10m_max: responseJSON.daily.wind_speed_10m_max[2],
                weather_code: responseJSON.daily.weather_code[2]
            },
            dayThreeData: {
                temperature_2m_max: responseJSON.daily.temperature_2m_max[3],
                precipitation_probability_max: responseJSON.daily.precipitation_probability_max[3],
                wind_speed_10m_max: responseJSON.daily.wind_speed_10m_max[3],
                weather_code: responseJSON.daily.weather_code[3]
            },
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
            }
        }
        
        console.log(weatherData);
        return weatherData;
    }catch(error){
        console.log('Error fetching weather data: ', error)
    }
}