const pool = require("../db");

async function getEntriesByUsername(username) {
  const result = await pool.query(
    `SELECT e.* FROM journal_entries e
     JOIN users u ON u.id = e.user_id
     WHERE u.username = $1
     ORDER BY e.id`,
    [username]
  );
  return result.rows;
}

async function createEntry(username, title, content) {
  const result = await pool.query(
    `INSERT INTO journal_entries (user_id, title, content)
     SELECT id, $2, $3 FROM users WHERE username = $1
     RETURNING *`,
    [username, title, content]
  );
  return result.rows[0];
}

async function updateEntry(id, title, content) {
  const result = await pool.query(
    "UPDATE journal_entries SET title = $1, content = $2 WHERE id = $3 RETURNING *",
    [title, content, id]
  );
  return result.rows[0];
}

async function deleteEntry(id) {
  await pool.query("DELETE FROM journal_entries WHERE id = $1", [id]);
}

async function createUser(username) {
  const result = await pool.query(
    "INSERT INTO users (username) VALUES ($1) RETURNING *",
    [username]
  );
  return result.rows[0];
}

module.exports = {
  getEntriesByUsername,
  createEntry,
  updateEntry,
  deleteEntry,
  createUser,
};