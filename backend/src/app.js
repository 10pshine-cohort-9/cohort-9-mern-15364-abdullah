import express from "express";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.json({
    message: "Notes API is running",
  });
});

app.use("/api/auth", authRoutes);

export default app;
