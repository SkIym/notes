import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Notes'
import noteService from './services/notes'
import Notification from './components/notif'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}

const App = () => {
    const [noteList, setNotes] = useState([])
    const [newNote, setNewNote] = useState(
        'a new note...'
    )
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState('some error happened...')

    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
        }, [])

    const notesToShow = showAll ? noteList : noteList.filter(note => note.important)

    const addNote = (e) => {
        e.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
        }
        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(noteList.concat(returnedNote))
                setNewNote('')
            })
    }

    const handleNoteChange = (e) => {
        console.log(e.target.value)
        setNewNote(e.target.value)
    }

    const toggleImportance = (id) => {
        const note = noteList.find(n => n.id === id)
        const changedNote = {...note, important: !note.important}

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
            setNotes(noteList.map(note => note.id !== id ? note : returnedNote))
            })
            .catch(error => {
                setErrorMessage(
                    `Note '${note.content}' was already removed from server`
                )
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
                setNotes(noteList.filter(n => n.id !== id))
            })
    }

    return (
    <div>
        <h1>Notes</h1>
        <Notification message={errorMessage} />
        <div>
            <button onClick={()=> setShowAll(!showAll)}>
                show { showAll ? 'important' : 'all' }
            </button>
        </div>
        <ul>
            {notesToShow.map(note => 
                <Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)}/>
            )}
        </ul>
        <form onSubmit={addNote}>
            <input value={newNote} onChange={handleNoteChange} />
            <button type='submit'>Save</button>
        </form>
        <Footer/>
    </div>
    )
}

export default App