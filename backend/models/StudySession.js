import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: String,
  topic: String,
  mood: String,
  duration: { type: Number, required: true },
  type: { type: String, default: "study" },
  completed: { type: Boolean, default: true },
  startedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("StudySession", schema);
