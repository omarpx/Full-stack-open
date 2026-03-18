import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ filter, onChange }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({ onSubmit, newName, onNameChange, newNumber, onNumberChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>name: <input value={newName} onChange={onNameChange} /></div>
      <div>number: <input value={newNumber} onChange={onNumberChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({ persons, onDelete }) => {
  return (
    <ul>
      {persons.map(person =>
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => onDelete(person.id, person.name)}>delete</button>
        </li>
      )}
    </ul>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setSuccessMessage(`Updated ${newName}`)
            setTimeout(() => setSuccessMessage(null), 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => setErrorMessage(null), 5000)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    }

    const personObject = { name: newName, number: newNumber }
    personService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setSuccessMessage(`Added ${newName}`)
      setTimeout(() => setSuccessMessage(null), 5000)
      setNewName('')
      setNewNumber('')
    })
  }


  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
        setSuccessMessage(`Deleted ${name}`)
        setTimeout(() => setSuccessMessage(null), 5000)
      })
    }
  }

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons



  return (
    <div>
      <h2>Phonebook</h2>
      {/*onnistunut notifikaatio*/}
      <Notification message={successMessage} type="success" />
    {/*virheellinen notifikaatio*/}
      <Notification message={errorMessage} type="error" />
      <Filter filter={filter} onChange={(event) => setFilter(event.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={(event) => setNewName(event.target.value)}
        newNumber={newNumber}
        onNumberChange={(event) => setNewNumber(event.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}



export default App