import PositiveMessages from './PositiveMessages';
import Journaling from './Journaling';
import Home from './Home';
import MoodTracking from './MoodTracking';
import NavBar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';

// Open Python backend, throw an error if there were any issues
const { spawn } = require('node:child_process');
const proc = spawn('python', ['../backend/main.py']);

proc.stderr.on('error', (err) => {
  console.error(`stderr: ${err}`);
});

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="msg" element={<PositiveMessages />} />
          <Route path="journal" element={<Journaling />} />
        </Routes>
      </main>
    </>
  );
  /*
  const showPage = 1;
  if (showPage === 0) {
    return <PositiveMessages />;
  } else if (showPage === 1) {
    return <Journaling />;
  } else {
    return <MoodTracking />;
  }
    */
}

export default App;
