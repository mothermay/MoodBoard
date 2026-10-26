import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  studyPreferences: {
    difficulty: { type: String, default: "medium" },
    dailyGoal: { type: Number, default: 60 }
  },
  subjects: { type: [String], default: [] },
  stats: {
    totalStudyMinutes: { type: Number, default: 0 },
    completedTopics: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 }
  },
  lastStudyDate: Date
}, { timestamps: true });

export default mongoose.model("User", userSchema);
