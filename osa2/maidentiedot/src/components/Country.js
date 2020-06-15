import React from 'react'
import Button from './Button'


const Country = ({ country, oneCountry }) => (
    <li>
        {country.name}
        <Button value={"show"} onClick={() => oneCountry(country)} />
    </li>
)

export default Country