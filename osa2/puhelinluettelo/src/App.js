import React, { useState, useEffect } from 'react'
import numberService from './services/numbers'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Person from './components/Person'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  useEffect(() => {
    numberService
      .getAll()
      .then(initialNotes => {
        setPersons(initialNotes)
      })
  }, [])

  const addPerson = (event) => {
      event.preventDefault()
      if (persons.map(person => person.name).includes(newName)) {
          if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
            const samePerson = persons.filter(p => p.name === newName)
            toggleNumberOf(samePerson[0].id)
            setNewNumber('')
            setNewName('')
          }
      } else {
      const personObject = {
          name: newName,
          number: newNumber,
      }

      numberService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
      }
    }

  const toggleNumberOf = id => {
    const person = persons.find(person => person.id === id)
    const changedNumber = { ...person, number: newNumber}

    numberService
      .update(id, changedNumber)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
      })
      .catch(error => {
        alert(
          `the person ${person.name} was already deleted from server`
        )
        setPersons(persons.filter(p => p.id !== id))
      })
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

  const deletePerson = (id, name) => {
    if(window.confirm(`Delete '${name}'?`)) {
      numberService
      .remove(id)
      .then(setPersons(persons.filter(person => person.id !== id)))
      .catch(error => {
        alert(
          `${name} was already deleted from server`
        )
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  const numbersToShow = persons.filter(person =>
    person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
  
  return (
    <div>
        <h1>Phonebook</h1>
        <Filter filter={filter} handleFilterChange={handleFilterChange}/>
        <h2>Add a new</h2>
        <PersonForm 
            addPerson= {addPerson} 
            newName={newName} 
            handleNameChange={handleNameChange} 
            newNumber={newNumber} 
            handleNumberChange={handleNumberChange}
        />
        <h2>Numbers</h2>
        <table>
          <tbody>
            {numbersToShow.map((person, i) =>
              <Person 
              key={i}
              person={person}
              deletePerson={() => deletePerson(person.id, person.name)}
              />
          )}
          </tbody>
        </table>
        
    </div>
  )
}

export default App