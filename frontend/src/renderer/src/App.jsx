import PositiveMessages from './PositiveMessages';
import Journaling from './Journaling';
import MoodTracking from './MoodTracking';

// Open Python backend, throw an error if there were any issues
const { spawn } = require('node:child_process');
const proc = spawn('python', ['../backend/main.py']);

proc.stderr.on('error', (err) => {
  console.error(`stderr: ${err}`);
});

function App() {
  const showPage = 0;
  if (showPage === 0) {
    return <PositiveMessages />;
  } else if (showPage === 1) {
    return <Journaling />;
  } else {
    return <MoodTracking />;
  }
}

export default App;
