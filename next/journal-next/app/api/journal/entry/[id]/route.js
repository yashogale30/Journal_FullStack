import { pool } from "@/lib/db";

export async function PUT(request, { params }) {
  const { id } = await params;
  const { title, content } = await request.json();
  const result = await pool.query(
    "UPDATE journal_entries SET title = $1, content = $2 WHERE id = $3 RETURNING *",
    [title, content, id]
  );
  if (result.rows.length === 0) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }
  return Response.json(result.rows[0]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await pool.query("DELETE FROM journal_entries WHERE id = $1", [id]);
  return Response.json({ deleted: true });
}