import QuizResult from "../models/QuizResult.js";

export async function save(req, res) {
  const { subject, topic, mood, score, total, answers, weakTopics = [] } = req.body;
  const safeTotal = Math.max(1, Number(total) || 1);
  const safeScore = Math.max(0, Number(score) || 0);
  const result = await QuizResult.create({
    user: req.userId,
    subject,
    topic,
    mood,
    score: safeScore,
    total: safeTotal,
    percentage: Math.round((safeScore / safeTotal) * 100),
    answers,
    weakTopics
  });
  res.status(201).json({ result });
}

export async function list(req, res) {
  const results = await QuizResult.find({ user: req.userId }).sort({ createdAt: -1 }).limit(100);
  res.json({ results });
}
