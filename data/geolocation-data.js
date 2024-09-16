export async function geolocationFetch(search) {
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