import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import noteRoutes from "./routes/notes.js";
import studyRoutes from "./routes/study.js";
import quizRoutes from "./routes/quiz.js";
import progressRoutes from "./routes/progress.js";
import moodRoutes from "./routes/moods.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const uploads = path.join(__dirname, "uploads");

fs.mkdirSync(uploads, { recursive: true });

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploads));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "MoodBoard API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/moods", moodRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.expose ? err.message : "Something went wrong on the server."
  });
});

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moodboard")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MoodBoard backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
