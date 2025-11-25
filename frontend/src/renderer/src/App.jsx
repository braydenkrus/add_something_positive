import Entry from './components/Entry'
import DeleteAlert from './components/DeleteAlert.jsx'
import { useState } from 'react'

function App() {
  // current entry in textbox
  const [entryQuery, setEntryQuery] = useState('')

  // set of entries
  const [entries, setEntries] = useState([])

  // choose what to render based on if we are ready
  const [readyToDisplayEntries, setReady] = useState(false)

  // for showing the spinner
  const [showSpinner, setShowSpinner] = useState(false)

  // for showing delete alert message
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  // for when we are ready to delete (user said yes to delete)
  // true for now, need to fix
  const [readyToDelete, setReadyToDelete] = useState(true)

  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // save entry, retrieve entries
  const saveEntry = async (e) => {
    setShowSpinner(true)
    e.preventDefault()
    const response = await fetch('http://127.0.0.1:5000/flask/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_entry: entryQuery })
    })
    alert(
      'You entered: ' +
        entryQuery +
        "\nLet's take a look at some other positive things you've entered!"
    )
    const fetchedEntries = await fetch('http://127.0.0.1:5000/flask/entries', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch again
    const finalEntries = await fetchedEntries.json()
    setEntries(finalEntries)
    setReady(true)
    setEntryQuery('') // TODO: part of fixing Issue #4, not complete yet.
    setShowSpinner(false)
  }
  // delete entry, update database, retrieve
  const executeDelete = async (id) => {
    setShowDeleteAlert(true)
    setShowSpinner(true)
    setReady(false)
    if (readyToDelete) {
      const deletion = await fetch('http://127.0.0.1:5000/flask/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delete_entry: id })
      })
      // TODO: Randomizing the order does not make sense for deletion.
      const fetchedEntries = await fetch('http://127.0.0.1:5000/flask/entries', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch again
      const finalEntries = await fetchedEntries.json()
      setEntries(finalEntries)
      setReady(true)
      setShowSpinner(false)
    }
    setShowDeleteAlert(false)
    setReadyToDelete(false)
  }

  const setDelete = () => {
    setReadyToDelete(true)
  }

  return (
    <>
      <h1>
        Add something <span className="react">positive</span> to your day
      </h1>
      <p>What is something good that happened today?</p>
      <div className="mb-3">
        <form onSubmit={saveEntry}>
          <input
            className="form-control"
            type="text"
            name="enter-message"
            placeholder="++++++++++++++++++++++"
            value={entryQuery}
            onChange={(e) => setEntryQuery(e.target.value)}
          />
          {/* https://stackoverflow.com/questions/9114664/spacing-between-elements 
      https://bobbyhadz.com/blog/react-jsx-add-whitespace-between-elements*/}
          <p style={{ width: 300 }}></p>
          <button type="submit" className="btn btn-primary">
            Save it!
          </button>
        </form>
      </div>
      <div>
        {readyToDisplayEntries ? (
          <div>
            {entries.map((entry) => (
              <Entry
                entry={entry}
                key={entry.id}
                id={entry.id}
                data={entry.data}
                onDelete={executeDelete}
              />
            ))}
          </div>
        ) : showSpinner ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div>{showDeleteAlert ? <DeleteAlert onDelete={setDelete} /> : <div></div>}</div>
    </>
  )
}

export default App
