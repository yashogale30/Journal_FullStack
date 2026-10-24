require("dotenv").config();
const http = require("http");
const pool = require("./db");

// Every response goes through this helper. It sets JSON and CORS headers.
function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

// Request bodies arrive in pieces. We collect them, then parse the JSON.
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    // Browsers send an OPTIONS "preflight" request before POST, PUT and DELETE
    if (req.method === "OPTIONS") return send(res, 204, null);

    // "/journal/yash" becomes ["journal", "yash"]
    const parts = req.url.split("/").filter(Boolean);
    const resource = parts[0];
    const param = parts[1];

    // POST /users
    if (req.method === "POST" && resource === "users") {
      const { username } = await readBody(req);
      const result = await pool.query(
        "INSERT INTO users (username) VALUES ($1) RETURNING *",
        [username]
      );
      return send(res, 201, result.rows[0]);
    }

    // GET /journal/:username
    if (req.method === "GET" && resource === "journal" && param) {
      const result = await pool.query(
        `SELECT e.* FROM journal_entries e
         JOIN users u ON u.id = e.user_id
         WHERE u.username = $1
         ORDER BY e.id`,
        [param]
      );
      return send(res, 200, result.rows);
    }

    // POST /journal/:username
    if (req.method === "POST" && resource === "journal" && param) {
      const { title, content } = await readBody(req);
      const result = await pool.query(
        `INSERT INTO journal_entries (user_id, title, content)
         SELECT id, $2, $3 FROM users WHERE username = $1
         RETURNING *`,
        [param, title, content]
      );
      if (result.rows.length === 0) return send(res, 404, { error: "User not found" });
      return send(res, 201, result.rows[0]);
    }

    // PUT /journal/:id
    if (req.method === "PUT" && resource === "journal" && param) {
      const { title, content } = await readBody(req);
      const result = await pool.query(
        "UPDATE journal_entries SET title = $1, content = $2 WHERE id = $3 RETURNING *",
        [title, content, param]
      );
      if (result.rows.length === 0) return send(res, 404, { error: "Entry not found" });
      return send(res, 200, result.rows[0]);
    }

    // DELETE /journal/:id
    if (req.method === "DELETE" && resource === "journal" && param) {
      await pool.query("DELETE FROM journal_entries WHERE id = $1", [param]);
      return send(res, 200, { deleted: true });
    }

    send(res, 404, { error: "Route not found" });
  } catch (err) {
    console.error(err);
    send(res, 500, { error: "Server error" });
  }
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));