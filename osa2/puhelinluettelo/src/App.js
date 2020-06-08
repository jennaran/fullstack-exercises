import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'



const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ searchResult, setSearchResult ] = useState([])

  const addPerson = (event) => {
      event.preventDefault()
      if (persons.map(person => person.name).includes(newName)) {
          window.alert(`${newName} is already added to phonebook`)
      } else {
      const personObject = {
          name: newName,
          number: newNumber,
          id: persons.length + 1
      }
      setPersons(persons.concat(personObject))
      }
      setNewName('')
      setNewNumber('')
    }

  const handleNameChange = (event) => {
      console.log('name:',event.target.value)
      setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
      console.log('nbr:',event.target.value)
      setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
      console.log('filter', event.target.value)
      setFilter(event.target.value)
  }

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  useEffect(() => {
    const results = persons.filter(person =>
      person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
      setSearchResult(results)
  }, [filter, persons])
  
  return (
    <div>
        <h1>Phonebook</h1>
        <div>
            <Filter filter={filter} handleFilterChange={handleFilterChange}/>
        </div>
        <h2>Add a new</h2>
        <PersonForm 
            addPerson= {addPerson} 
            newName={newName} 
            handleNameChange={handleNameChange} 
            newNumber={newNumber} 
            handleNumberChange={handleNumberChange}
        />
        <h2>Numbers</h2>
        <Persons persons = {searchResult} />
    </div>
  )
}

export default App