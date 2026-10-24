import EntryItem from "./EntryItem";

function EntryList({ entries, onDelete, onEdit }) {
  return (
    <div>
      {entries.map((entry) => (
        <EntryItem
          key={entry.id}
          entry={entry}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default EntryList;