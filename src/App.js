import './App.css';
import CurrentWeather from './components/current-weather/current-weather';
import { WEATHER_API_URL, WEATHER_API_KEY } from './api';
import Search from './components/search/search';
import { useEffect, useState } from 'react';
import Forecast from './components/forecast/forecast';


function App() {

  console.log('rerender');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForcast] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      const apiEndpoint = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`

      fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          const city = data.address.county;
          console.log(`Your current city is ${city}`);
          const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`);
          const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`);


          Promise.all([currentWeatherFetch, forecastFetch]).then(async (response) => {
            const weatherResponse = await response[0].json();
            const forecastResponse = await response[1].json();

            setCurrentWeather({ city: city, ...weatherResponse });
            setForcast({ city: city, ...forecastResponse });
          })
        })
        .catch(error => console.error(error));
    }, error => {
      console.error(error);
    });

  }, [])

  const handleOnSearchChange = (searchData) => {

    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);


    Promise.all([currentWeatherFetch, forecastFetch]).then(async (response) => {
      const weatherResponse = await response[0].json();
      const forecastResponse = await response[1].json();

      setCurrentWeather({ city: searchData.label, ...weatherResponse });
      setForcast({ city: searchData.label, ...forecastResponse });
    })

  }
  console.log('current weather: ', currentWeather);
  console.log('forecast: ', forecast);
  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
