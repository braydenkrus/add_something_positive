import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import Entry from './components/Entry'
import { useState } from 'react'

function App() {
  const [entryQuery, setEntryQuery] = useState('')

  const [entries, setEntries] = useState([])

  const [readyToDisplayEntries, setReady] = useState(false)

  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // save entry, retrieve entries
  const saveEntry = async (e) => {
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
    console.log(response)
    const fetchedEntries = await fetch('http://127.0.0.1:5000/flask/entries', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch again
    const finalEntries = await fetchedEntries.json()
    setEntries(finalEntries)
    setReady(true)
  }
  // delete entry, update database, retrieve
  const executeDelete = async (id) => {
    setReady(false)
    const deletion = await fetch('http://127.0.0.1:5000/flask/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delete_entry: id })
    })
    const fetchedEntries = await fetch('http://127.0.0.1:5000/flask/entries', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch again
    const finalEntries = await fetchedEntries.json()
    setEntries(finalEntries)
    setReady(true)
  }

  return (
    <>
      <h1>
        Add something <span className="react">positive</span> to your day
      </h1>
      <p className="tip">What is something good that happened today?</p>
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
        ) : (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
    </>
  )
}

export default App
