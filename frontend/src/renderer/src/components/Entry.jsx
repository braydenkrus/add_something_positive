function Entry({ entry, onDelete }) {
  // entries
  return (
    <div className="alert alert-light">
      <h3>{entry.data}</h3>
      <button onClick={() => onDelete(entry.id)} className="btn btn-danger">
        Delete
      </button>
    </div>
  )
}

export default Entry
