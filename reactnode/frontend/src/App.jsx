import { useState, useEffect } from "react";
import EntryList from "./components/EntryList";
import { getEntries, createEntry, updateEntry, deleteEntry } from "./api";

function App() {
  const [username, setUsername] = useState("testuser");
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadEntries() {
    try {
      setLoading(true);
      setError("");
      const data = await getEntries(username);
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Runs on page load, and again whenever username changes
  useEffect(() => {
    let cancelled = false;

    async function refreshEntries() {
      try {
        setLoading(true);
        setError("");
        const data = await getEntries(username);
        if (!cancelled) setEntries(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    refreshEntries();
    return () => {
      cancelled = true;
    };
  }, [username]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId === null) {
        await createEntry(username, title, content);
      } else {
        await updateEntry(editingId, title, content);
      }
      resetForm();
      await loadEntries();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteEntry(id);
      await loadEntries();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(entry) {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  return (
    <div>
      <h1>My Journal</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button type="submit">
          {editingId === null ? "Add Entry" : "Save Changes"}
        </button>
        {editingId !== null && (
          <button type="button" onClick={resetForm}>Cancel</button>
        )}
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <EntryList entries={entries} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
}

export default App;