import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Journal from './components/Journal';

function Journaling() {
  const [currentJournal, setCurrentJournal] = useState('');

  const [journals, setJournals] = useState([]);

  const [showJournals, setShowJournals] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);

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
    const fetchedJournals = await fetch('http://127.0.0.1:5000/flask/retrieveJournals', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!fetchedJournals.ok) {
      throw new Error(`Response status: ${fetchedJournals.status}`);
    }
    const finalJournals = await fetchedJournals.json();
    setJournals(finalJournals);
    setShowJournals(true);
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
        <></>
      ) : (
        <></>
      )}
    </>
  );
}

export default Journaling;
