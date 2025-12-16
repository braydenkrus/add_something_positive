import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Journal from './components/Journal';

function Journaling() {
  const [currentJournal, setCurrentJournal] = useState('');

  const [journals, setJournals] = useState([]);

  const [showJournals, setShowJournals] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);

  // not ready to show entries, show spinner
  const startLoading = () => {
    setShowJournals(false);
    setShowSpinner(true);
  };

  // ready to show entries, don't show spinner
  const stopLoading = () => {
    setShowJournals(true);
    setShowSpinner(false);
  };

  const retrieveJournals = async () => {
    // order doesn't matter since it is always the same
    startLoading();
    const fetchedJournals = await fetch('http://127.0.0.1:5000/flask/retrieveJournals', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!fetchedJournals.ok) {
      throw new Error(`Response status: ${fetchedJournals.status}`);
    }
    const finalJournals = await fetchedJournals.json();
    setJournals(finalJournals);
    stopLoading();
  };

  const saveJournal = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/flask/saveJournal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_journal: currentJournal })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    retrieveJournals();
  };

  return (
    <>
      <h1>What's on your mind?</h1>
      <form id="journalForm" onSubmit={saveJournal}>
        <div className="mb-3">
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            name="journalFormText"
            value={currentJournal}
            onChange={(e) => setCurrentJournal(e.target.value)}
          ></textarea>
        </div>
        <p style={{ width: 300 }}></p>
        <button type="submit" className="btn btn-primary">
          Save it!
        </button>
      </form>
      {showJournals ? (
        <div>
          {journals.map((journal) => (
            <Journal
              journal={journal}
              key={journal.id}
              id={journal.id}
              data={journal.data}
              date={journal.date}
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
    </>
  );
}

export default Journaling;
