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
  // const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  // need to fix
  // const [readyToDelete, setReadyToDelete] = useState(true)

  // https://www.dhiwise.com/post/a-step-by-step-guide-to-retrieving-input-values-in-react
  // to be more explicit with how I'm writing this. Also, this should be a good resource
  // if I want to expand on the inputs.
  const handleQueryChange = (e) => {
    setEntryQuery(e.target.value)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // save entry, retrieve entries
  const saveEntry = async (e) => {
    e.preventDefault()
    // https://www.w3schools.com/Jsref/met_form_reset.asp
    document.getElementById('queryForm').reset()
    // https://github.com/electron/electron/issues/22923 May help with Issue #4.
    // Based on this, I should follow through with making custom popups.
    setEntryQuery('') // TODO: part of fixing Issue #4, not complete yet.
    setShowSpinner(true)
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
    setShowSpinner(false)
  }
  // delete entry, update database, retrieve
  const executeDelete = async (id) => {
    /* 
    Note that this is an Electron app. If this was a browser app,
    the prompt would be stylized according to the web browser 
    https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
    */
    const deleting = confirm('Are you sure you want to delete?')
    if (deleting) {
      // setShowDeleteAlert(false)
      setShowSpinner(true)
      setReady(false)
      const deletion = await fetch('http://127.0.0.1:5000/flask/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delete_entry: id })
      })
      // https://www.geeksforgeeks.org/javascript/remove-array-element-based-on-object-property-in-javascript/
      // for fix. match the ID and delete locally alongside database.
      // avoids a second retrieval and having to possibly retrieve the random seed.
      let finalEntries = entries
      let rem = finalEntries.findIndex((finalEntries) => finalEntries.id === id)
      finalEntries.splice(rem, 1)
      setEntries(finalEntries)
      setReady(true)
      setShowSpinner(false)
    }
    // setShowDeleteAlert(false)
    // setReadyToDelete(false)
  }

  /*
  const setDelete = () => {
    setReadyToDelete(true)
  }
    */

  return (
    <>
      <h1>
        Add something <span className="react">positive</span> to your day
      </h1>
      <p>What is something good that happened today?</p>
      <div className="mb-3">
        <form id="queryForm" onSubmit={saveEntry}>
          <input
            className="form-control"
            type="text"
            name="enter-message"
            placeholder="++++++++++++++++++++++"
            value={entryQuery}
            onChange={handleQueryChange}
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
      {/*  <div>{showDeleteAlert ? <DeleteAlert onDelete={setDelete} /> : <div></div>}</div>*/}
    </>
  )
}

export default App
