import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Search from './components/Search'
import Countries from './components/Countries'

const App = () => {
    const [ countries, setCountries ] = useState([])
    const [ search, setSearch ] = useState('')
    const [ searchResult, setSearchResult ] = useState([])

    useEffect(() => {
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    useEffect(() => {
        const results = countries.filter(country =>
            country
                .name
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase()))
            setSearchResult(results)
    }, [search, countries])

    const handleSearchChange = (event) => {
        console.log('search for ', event.target.value)
        setSearch(event.target.value)
    }

    return (
        <div>
            <Search value = {search} onChange={handleSearchChange} />
            <Countries countries = {searchResult} />
        </div>
    )
}

export default App