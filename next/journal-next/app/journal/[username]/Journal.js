"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Journal({ username, entries }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId === null) {
      await fetch(`/api/journal/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    } else {
      await fetch(`/api/journal/entry/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    }
    resetForm();
    router.refresh();
  }

  async function handleDelete(id) {
    await fetch(`/api/journal/entry/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function handleEdit(entry) {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
  }

  return (
    <div>
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

      {entries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.title}</h3>
          <p>{entry.content}</p>
          <button onClick={() => handleEdit(entry)}>Edit</button>
          <button onClick={() => handleDelete(entry.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}