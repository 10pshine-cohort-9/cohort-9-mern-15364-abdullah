import pool from "../config/db.js";

export async function findUserByEmail(email) {
  const query = `
    SELECT * FROM users
    WHERE email = $1
  `;

  const { rows } = await pool.query(query, [email]);
  return rows[0];
}

export async function findUserById(id) {
  const query = `
    SELECT id, full_name, email, created_at
    FROM users
    WHERE id = $1
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
}

export async function createUser(fullName, email, hashedPassword) {
  const query = `
    INSERT INTO users (full_name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, full_name, email, created_at
  `;

  const { rows } = await pool.query(query, [fullName, email, hashedPassword]);

  return rows[0];
}
