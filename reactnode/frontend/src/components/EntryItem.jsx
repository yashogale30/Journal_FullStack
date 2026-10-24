function EntryItem({ entry, onDelete, onEdit }) {
  return (
    <div>
      <h3>{entry.title}</h3>
      <p>{entry.content}</p>
      <button onClick={() => onEdit(entry)}>Edit</button>
      <button onClick={() => onDelete(entry.id)}>Delete</button>
    </div>
  );
}

export default EntryItem;