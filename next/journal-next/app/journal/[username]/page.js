import { pool } from "@/lib/db";
import Journal from "./Journal";

export const dynamic = "force-dynamic";

export default async function JournalPage({ params }) {
  const { username } = await params;

  const result = await pool.query(
    `SELECT e.id, e.title, e.content FROM journal_entries e
     JOIN users u ON u.id = e.user_id
     WHERE u.username = $1
     ORDER BY e.id`,
    [username]
  );

  return (
    <div>
      <h1>Journal of {username}</h1>
      <Journal username={username} entries={result.rows} />
    </div>
  );
}