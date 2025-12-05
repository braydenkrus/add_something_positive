import Entry from './components/Entry'
import { useState } from 'react'
// React Bootstrap for modals
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

// had weird issues with this. in short enabled nodeIntegration and contextIsolation
// in out/main/index.js AND src/main/index.js
// "overwriting": I was doing it in out instead of src!
const { spawn } = require('node:child_process')

const proc = spawn('python', ['../backend/main.py'])

proc.stderr.on('error', (err) => {
  console.error(`stderr: ${err}`)
})

function App() {
  // current entry in textbox
  const [entryQuery, setEntryQuery] = useState('')

  // set of entries
  const [entries, setEntries] = useState([])

  // choose what to render based on if we are ready
  const [readyToDisplayEntries, setReady] = useState(false)

  // for showing the spinner
  const [showSpinner, setShowSpinner] = useState(false)

  // for entry submission modal
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)

  const handleSubmissionClose = () => {
    setShowSubmissionModal(false)
    setEntryQuery('')
  }

  const handleSubmissionOpen = () => setShowSubmissionModal(true)

  // for deletion modal
  const [showDeletionModal, setShowDeletionModal] = useState(false)

  const handleDeletionClose = () => setShowDeletionModal(false)

  const handleDeletionOpen = () => setShowDeletionModal(true)

  // to take note of what is currently being deleted
  const [entryToDelete, setEntryToDelete] = useState(-1)

  // https://www.dhiwise.com/post/a-step-by-step-guide-to-retrieving-input-values-in-react
  // to be more explicit with how I'm writing this. Also, this should be a good resource
  // if I want to expand on the inputs.
  const handleQueryChange = (e) => {
    setEntryQuery(e.target.value)
  }

  // not ready to show entries, show spinner
  const startLoading = () => {
    setReady(false)
    setShowSpinner(true)
  }

  // ready to show entries, don't show spinner
  const stopLoading = () => {
    setReady(true)
    setShowSpinner(false)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // save entry, retrieve entries
  const saveEntry = async (e) => {
    e.preventDefault()
    startLoading()
    // https://github.com/electron/electron/issues/22923 May help with Issue #4.
    // This was the fix!
    handleSubmissionOpen()
    const response = await fetch('http://127.0.0.1:5000/flask/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_entry: entryQuery })
    })
    const fetchedEntries = await fetch('http://127.0.0.1:5000/flask/entries', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch again
    const finalEntries = await fetchedEntries.json()
    setEntries(finalEntries)
    stopLoading()
    // https://www.w3schools.com/Jsref/met_form_reset.asp
    document.getElementById('queryForm').reset()
  }
  // delete entry, update database, retrieve
  const executeDelete = async () => {
    let id = entryToDelete
    startLoading()
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
    setEntryToDelete(-1)
    stopLoading()
    handleDeletionClose()
  }

  const setEntryAndModal = (id) => {
    setEntryToDelete(id)
    handleDeletionOpen()
  }

  return (
    <>
      <h1>Add something positive to your day</h1>
      <div className="mb-3">
        <form id="queryForm" onSubmit={saveEntry}>
          <input
            className="form-control"
            type="text"
            name="enter-message"
            placeholder="What is something good that happened today?"
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
                onDelete={setEntryAndModal}
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
      <Modal show={showDeletionModal} onHide={handleDeletionClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this entry?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={executeDelete}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleDeletionClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSubmissionModal} onHide={handleSubmissionClose}>
        <Modal.Header closeButton>
          <Modal.Title>Entry!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You entered: {entryQuery}. Let's take a look at some other positive things you've entered!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmissionClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default App
