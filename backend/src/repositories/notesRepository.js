import pool from "../config/db.js";

async function createNote(title, content, userId) {
  const query = `
    INSERT INTO notes (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [title, content, userId];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function getNotesByUserId(userId) {
  const query = `
    SELECT *
    FROM notes
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
}

async function getNoteById(noteId, userId) {
  const query = `
    SELECT *
    FROM notes
    WHERE id = $1
      AND user_id = $2;
  `;

  const result = await pool.query(query, [noteId, userId]);

  return result.rows[0];
}

async function updateNote(noteId, title, content, userId) {
  const query = `
    UPDATE notes
    SET
      title = $1,
      content = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
      AND user_id = $4
    RETURNING *;
  `;

  const values = [title, content, userId];

  const result = await pool.query(query, [title, content, noteId, userId]);

  return result.rows[0]

}
  
async function deleteNote(noteId, userId) {
  const query = `
    DELETE FROM notes
    WHERE id = $1
      AND user_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [noteId, userId]);

  return result.rows[0];
}

export { createNote, getNotesByUserId, getNoteById, updateNote, deleteNote };
