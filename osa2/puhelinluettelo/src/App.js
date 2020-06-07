import React, { useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'


const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

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

  return (
    <div>
        <h1>Phonebook</h1>
        <div>
            filter show with <input />
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
        <Persons persons = {persons} />
    </div>
  )
}

export default App