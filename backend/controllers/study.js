import StudySession from "../models/StudySession.js";
import User from "../models/User.js";
import MoodHistory from "../models/MoodHistory.js";

function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export async function create(req, res) {
  const { subject, topic, mood, duration, type, completed = true } = req.body;
  const minutes = Math.max(1, Math.round(Number(duration) || 0));
  if (!minutes) return res.status(400).json({ message: "A valid duration is required." });

  const session = await StudySession.create({
    user: req.userId, subject, topic, mood, duration: minutes, type, completed
  });

  const user = await User.findById(req.userId);
  user.stats.totalStudyMinutes += minutes;

  const today = dayKey(new Date());
  const last = user.lastStudyDate ? dayKey(user.lastStudyDate) : null;
  if (last !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    user.stats.currentStreak = last === dayKey(yesterday) ? user.stats.currentStreak + 1 : 1;
    user.stats.longestStreak = Math.max(user.stats.longestStreak, user.stats.currentStreak);
    user.lastStudyDate = new Date();
  }

  await user.save();

  if (mood) {
    await MoodHistory.create({ user: req.userId, mood, subject, studyDuration: minutes });
  }

  res.status(201).json({ session, stats: user.stats });
}

export async function list(req, res) {
  const sessions = await StudySession.find({ user: req.userId }).sort({ createdAt: -1 }).limit(100);
  res.json({ sessions });
}
