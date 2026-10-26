import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: String,
  topic: String,
  mood: String,
  score: Number,
  total: Number,
  percentage: Number,
  weakTopics: [String],
  answers: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("QuizResult", schema);
