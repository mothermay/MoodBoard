import StudySession from "../models/StudySession.js";
import QuizResult from "../models/QuizResult.js";
import MoodHistory from "../models/MoodHistory.js";
import User from "../models/User.js";

export async function getProgress(req, res) {
  const [sessions, quizzes, moods, user] = await Promise.all([
    StudySession.find({ user: req.userId }).sort({ createdAt: -1 }).limit(500).lean(),
    QuizResult.find({ user: req.userId }).sort({ createdAt: -1 }).limit(100).lean(),
    MoodHistory.find({ user: req.userId }).sort({ createdAt: -1 }).limit(200).lean(),
    User.findById(req.userId).lean()
  ]);

  const byDay = {};
  sessions.forEach(s => {
    const key = new Date(s.createdAt).toISOString().slice(0, 10);
    byDay[key] = (byDay[key] || 0) + s.duration;
  });

  const avgQuiz = quizzes.length
    ? Math.round(quizzes.reduce((sum, q) => sum + q.percentage, 0) / quizzes.length)
    : 0;

  const moodCounts = {};
  moods.forEach(m => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });

  res.json({
    stats: user?.stats || {},
    totalSessions: sessions.length,
    averageQuiz: avgQuiz,
    weeklyStudy: Object.entries(byDay).slice(-7).map(([date, minutes]) => ({ date, minutes })),
    quizPerformance: quizzes.slice(0, 10).reverse().map(q => ({ date: q.createdAt, percentage: q.percentage })),
    moodDistribution: moodCounts,
    topicCompletion: sessions.filter(s => s.completed).length
  });
}
