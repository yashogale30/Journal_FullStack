import { pool } from "@/lib/db";

export async function GET(request, { params }) {
  const { username } = await params;
  const result = await pool.query(
    `SELECT e.* FROM journal_entries e
     JOIN users u ON u.id = e.user_id
     WHERE u.username = $1
     ORDER BY e.id`,
    [username]
  );
  return Response.json(result.rows);
}

export async function POST(request, { params }) {
  const { username } = await params;
  const { title, content } = await request.json();
  const result = await pool.query(
    `INSERT INTO journal_entries (user_id, title, content)
     SELECT id, $2, $3 FROM users WHERE username = $1
     RETURNING *`,
    [username, title, content]
  );
  if (result.rows.length === 0) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return Response.json(result.rows[0], { status: 201 });
}