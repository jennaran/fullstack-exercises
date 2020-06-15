import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({country}) => {
    const url = `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${country.capital}`
    const [ weather, setWeather ] = useState({temperature: "", weather_icons: "", wind_speed: "", wind_dir: "", weather_descriptions: ""})

    useEffect(() => {
        axios
          .get(url)
          .then(response => {setWeather(response.data.current)})
    }, [country, url])

    return (
        <div>
            <p>temperature: {weather.temperature} Celsius</p>
            <p>{weather.weather_icons ? weather.weather_icons.map((imgUrl, key) => <img key={key} src={imgUrl} alt="Weather icon" />) : null} </p>
            <p>wind: {weather.wind_speed} mph direction {weather.wind_dir}</p>
        </div>
    )
}

export default Weather