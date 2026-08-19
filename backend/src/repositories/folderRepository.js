import pool from "../config/db.js";
import logger from "../config/logger.js";

async function createFolder(name, userId) {
  const query = `
    INSERT INTO folders (name, user_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [name, userId]);
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error creating folder");
    throw error;
  }
}

async function updateFolder(folderId, name, userId) {
  const query = `
    UPDATE folders
    SET name = $1
    WHERE id = $2
      AND user_id = $3
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [name, folderId, userId]);
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error updating folder");
    throw error;
  }
}

async function deleteFolder(folderId, userId) {
  const query = `
    DELETE FROM folders
    WHERE id = $1
      AND user_id = $2
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [folderId, userId]);
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error deleting folder");
    throw error;
  }
}

async function getFolderById(folderId, userId) {
  const query = `
    SELECT *
    FROM folders
    WHERE id = $1
      AND user_id = $2;
  `;

  try {
    const result = await pool.query(query, [folderId, userId]);
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error fetching folder");
    throw error;
  }
}

export { createFolder, updateFolder, deleteFolder, getFolderById };
