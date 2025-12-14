function Journal({ journal }) {
  // entries
  return (
    <div className="alert alert-light">
      <h1>{journal.date}</h1>
      <p>{journal.data}</p>
    </div>
  );
}

export default Journal;
