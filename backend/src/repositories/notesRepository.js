import pool from "../config/db.js";
import logger from "../config/logger.js";

async function createNote(title, content, userId) {
  const query = `
    INSERT INTO notes (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [title, content, userId];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error creating note");
    throw new Error("Error creating note");
  }
}

async function getNotesByUserId(userId) {
  const query = `
    SELECT *
    FROM notes
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    logger.error({ err: error }, "Error fetching notes");
    throw new Error("Error fetching notes");
  }
}

async function getNoteById(noteId, userId) {
  const query = `
    SELECT *
    FROM notes
    WHERE id = $1
      AND user_id = $2;
  `;

  const values = [noteId, userId];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error fetching note");
    throw new Error("Error fetching note");
  }
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

  const values = [title, content, noteId, userId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error updating note");
    throw new Error("Error updating note");
  }
}

async function deleteNote(noteId, userId) {
  const query = `
    DELETE FROM notes
    WHERE id = $1
      AND user_id = $2
    RETURNING *;
  `;

  const values = [noteId, userId];
  try {
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error deleting note");
    throw new Error("Error deleting note");
  }
}

export { createNote, getNotesByUserId, getNoteById, updateNote, deleteNote };
