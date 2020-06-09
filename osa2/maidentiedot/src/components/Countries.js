import React from 'react'
import Name from './Name'
import CountryView from './CountryView'


const Countries = ({ countries }) => {
    if (countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }
    if (countries.length === 1) {
        return <CountryView country = {countries[0]} />
    }
    return (
        <div>
            {countries.map((country, key) =>
                <Name key={key} value={country} />
            )}
        </div>
    )
}


export default Countries