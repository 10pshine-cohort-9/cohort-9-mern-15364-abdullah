import app from "./app.js";
import pool from "./config/db.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    logger.info("Database connected successfully");

    app.listen(PORT, () => {
      logger.info(`App is running on ${PORT}`);
    }); 
  } catch (error) {
    logger.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
} 

startServer();
