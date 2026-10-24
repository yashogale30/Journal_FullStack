const BASE_URL = "http://localhost:3000";

export async function getEntries(username) {
  const res = await fetch(`${BASE_URL}/journal/${username}`);
  if (!res.ok) throw new Error("Failed to load entries");
  return res.json();
}

export async function createEntry(username, title, content) {
  const res = await fetch(`${BASE_URL}/journal/${username}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("Failed to create entry");
  return res.json();
}

export async function updateEntry(id, title, content) {
  const res = await fetch(`${BASE_URL}/journal/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("Failed to update entry");
  return res.json();
}

export async function deleteEntry(id) {
  const res = await fetch(`${BASE_URL}/journal/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete entry");
  return res.json();
}