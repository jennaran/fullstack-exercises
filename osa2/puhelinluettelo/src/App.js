import React, { useState, useEffect } from 'react'
import numberService from './services/numbers'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Person from './components/Person'
import Notification from './components/Notification'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ messageType, setMessageType ] = useState("message")

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

          setMessage(
            `Added ${newName}`
            )
            setMessageType("message")
            setTimeout(() => {
              setMessage(null)
            }, 3000);
        }).catch(error => {
          setMessage(
            error.response.data.error
            )
            setMessageType("error")
            setTimeout(() => {
              setMessage(null)
            }, 3000);
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
        setMessage(
          `Updated ${person.name}`
        )
        setMessageType("message")
        setTimeout(() => {
          setMessage(null)
        }, 3000);
      })
      .catch(error => {
        setMessage(
          `${person.name} was already deleted from server or number is in incorrect form`
        )
        setMessageType("error")
        setTimeout(() => {
          setMessage(null)
        }, 3000);
//        setPersons(persons.filter(person => person.id !== id))
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
      .then(returnedPerson => { 
        setPersons(persons.filter(person => person.id !== id))
        setMessage(
          `Deleted ${name}`
        )
        setMessageType("message")
        setTimeout(() => {
          setMessage(null)
        }, 3000);
      })
      .catch(error => {
        setMessage(
          `${name} was already deleted from server`
        )
        setMessageType("error")
        setTimeout(() => {
          setMessage(null)
        }, 3000);
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  const numbersToShow = filter.length === 0 ?
    persons :
    persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase()))
  
  return (
    <div>
        <h1>Phonebook</h1>
        <Notification message={message} type={messageType} />
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