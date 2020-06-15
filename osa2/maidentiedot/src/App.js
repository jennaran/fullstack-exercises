import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Search from './components/Search'
import Country from './components/Country'
import CountryView from './components/CountryView'

const App = () => {
    const [ countries, setCountries ] = useState([])
    const [ search, setSearch ] = useState('')
    const [ picked, setPicked ] = useState([])

    useEffect(() => {
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    const handleSearchChange = (event) => {
        setPicked([])
        console.log('search for ', event.target.value)
        setSearch(event.target.value)
    }

    const countriesToShow = picked.length > 0 ?
    picked :
    countries.filter(country =>
        country
            .name
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
    )

    const pickOneCountry = (country) => {
        console.log("yhden nimi", country.name)
        setPicked([country])
    }

    return (
        <div>
            <Search value = {search} onChange={handleSearchChange} />

            {countriesToShow.length > 0 ?
                countriesToShow.length === 1 ?
                    <CountryView country = {countriesToShow[0]} /> :
                    countriesToShow.length > 10 ?
                        <p>Too many matches, specify another filter</p> :
                        <ul>
                        {countriesToShow.map((country, key) => 
                            <Country key={key} country={country} oneCountry={pickOneCountry} />)}
                        </ul> :
                <p>No matches </p>
            }  
        </div>
    )
}

export default App