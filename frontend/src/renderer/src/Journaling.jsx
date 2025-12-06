import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Journaling() {
  const [currentJournal, setCurrentJournal] = useState('');

  const saveJournal = async (e) => {
    return 0;
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
      </form>
    </>
  );
}

export default Journaling;
