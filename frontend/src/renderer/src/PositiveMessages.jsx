import Entry from './components/Entry';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function PositiveMessages() {
  // current entry in textbox
  const [entryQuery, setEntryQuery] = useState('');

  // set of entries
  const [entries, setEntries] = useState([]);

  // choose what to render based on if we are ready
  const [readyToDisplayEntries, setReady] = useState(false);

  // for showing the spinner
  const [showSpinner, setShowSpinner] = useState(false);

  // for entry submission modal
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const handleSubmissionClose = () => {
    setShowSubmissionModal(false);
    setEntryQuery('');
  };

  const handleSubmissionOpen = () => setShowSubmissionModal(true);

  // for deletion modal
  const [showDeletionModal, setShowDeletionModal] = useState(false);

  const handleDeletionOpen = () => setShowDeletionModal(true);

  // to take note of what is currently being deleted
  const [entryToDelete, setEntryToDelete] = useState(-1);

  // not ready to show entries, show spinner
  const startLoading = () => {
    setReady(false);
    setShowSpinner(true);
  };

  // ready to show entries, don't show spinner
  const stopLoading = () => {
    setReady(true);
    setShowSpinner(false);
  };

  // when deletion modal is closed run this
  const handleDeletionClose = () => {
    setShowDeletionModal(false);
    setEntryToDelete(-1);
  };

  // helper for executeDelete
  const updateEntries = () => {
    // https://www.geeksforgeeks.org/javascript/remove-array-element-based-on-object-property-in-javascript/
    let finalEntries = entries;
    let rem = finalEntries.findIndex((finalEntries) => finalEntries.id === entryToDelete);
    finalEntries.splice(rem, 1);
    setEntries(finalEntries);
  };

  // save entry to database
  const saveEntry = async (e) => {
    e.preventDefault();
    startLoading();
    handleSubmissionOpen();
    const response = await fetch('http://127.0.0.1:5000/flask/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_entry: entryQuery })
    });
    const fetchedEntries = await fetch('http://127.0.0.1:5000/flask/entries', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const finalEntries = await fetchedEntries.json();
    setEntries(finalEntries);
    stopLoading();
  };

  // delete entry, update database, retrieve
  const executeDelete = async () => {
    startLoading();
    const deletion = await fetch('http://127.0.0.1:5000/flask/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delete_entry: entryToDelete })
    });
    updateEntries();
    handleDeletionClose();
    stopLoading();
  };

  const setEntryAndModal = (id) => {
    setEntryToDelete(id);
    handleDeletionOpen();
  };

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
            onChange={(e) => setEntryQuery(e.target.value)}
          />
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
          <></>
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
  );
}

export default PositiveMessages;
