import MoodHistory from "../models/MoodHistory.js";

export async function list(req, res) {
  const moods = await MoodHistory.find({ user: req.userId }).sort({ createdAt: -1 }).limit(200);
  res.json({ moods });
}
