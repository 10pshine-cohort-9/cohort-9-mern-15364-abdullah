import app from "./app.js";
import pool from "./config/db.js";


const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");


    app.listen(PORT, () => {
      console.log(`App is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
}

startServer();