import React from 'react'
import Weather from './Weather'

const CountryView = ({ country }) => {
    return (
        <div>
            <h2>{country.name}</h2>
            <p>Capital: {country.capital}</p>
            <p>Population: {country.population}</p>
            <h3>Languages</h3>
            <ul>
                {country.languages.map((language, key) => 
                    <li key= {key}>{language.name}</li>)}
            </ul>
            <img src={country.flag} alt='The flag' width="30%" height="30%"/>
            <h2>Weather in {country.capital}</h2>
            <Weather country={ country } />
        </div>
    )
}

export default CountryView