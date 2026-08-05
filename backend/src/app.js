import express from "express";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  }),
);
app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.json({
    message: "Notes API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

export default app;
