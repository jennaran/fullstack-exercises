import React from 'react'
import Name from './Name'

const CountryView = ({ country }) => {
    return (
        <div>
            <h2>{country.name}</h2>
            <p>{country.capital}</p>
            <p>{country.population}</p>
            <h3>Languages</h3>
            <div>
                {country.languages.map((lan, key) => 
                    <Name key={key} value={lan} />)}
            </div>
            <div>
            <img src={country.flag} alt='The flag'/>
            </div>
        </div>
    )
}

export default CountryView