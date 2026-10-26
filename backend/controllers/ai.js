import Note from "../models/Note.js";
import QuizResult from "../models/QuizResult.js";
import StudySession from "../models/StudySession.js";
import MoodHistory from "../models/MoodHistory.js";
import { askGemini } from "../services/gemini.js";
import { getMoodConfig } from "../services/moods.js";
import { studyPlanPrompt, summaryPrompt, flashcardPrompt, quizPrompt, explanationPrompt, mockFeedbackPrompt, schemas } from "../services/prompts.js";

function validatePlan(data, minutes) {
  if (!data || !Array.isArray(data.sessions) || data.sessions.length === 0) throw new Error("AI returned an empty study plan.");
  const sessions = data.sessions.filter(s => Number(s.duration) > 0 && s.activity);
  const total = sessions.reduce((sum, s) => sum + Number(s.duration), 0);
  if (!sessions.length || total > Number(minutes) + 5) throw new Error("AI plan did not fit the available time.");
  return { ...data, sessions, totalMinutes: total };
}

function validateQuiz(data) {
  if (!data?.questions?.length) throw new Error("AI returned no quiz questions.");
  const questions = data.questions.filter(q =>
    q.question && Array.isArray(q.options) && q.options.length === 4 &&
    Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < 4
  );
  if (!questions.length) throw new Error("AI returned invalid quiz questions.");
  return { questions };
}

export async function studyPlan(req, res) {
  const { subject, topics, examDate, availableMinutes, mood, difficulty } = req.body;
  if (!subject || !topics || !availableMinutes || !mood) return res.status(400).json({ message: "Subject, topics, time and mood are required." });

  const history = await QuizResult.find({ user: req.userId }).sort({ createdAt: -1 }).limit(10).lean();
  const plan = await askGemini(studyPlanPrompt({
    subject, topics, examDate, availableMinutes, mood, difficulty,
    history: history.map(x => `${x.subject}: ${x.percentage}% weak=${(x.weakTopics || []).join(",")}`).join("\n")
  }), schemas.plan);

  const valid = validatePlan(plan, availableMinutes);

  await MoodHistory.create({
    user: req.userId,
    mood,
    subject,
    studyDuration: 0,
    performance: 0
  });

  res.json({ plan: valid, moodConfig: getMoodConfig(mood) });
}

export async function summary(req, res) {
  const { noteId, subject, mood } = req.body;
  const note = await Note.findOne({ _id: noteId, user: req.userId });
  if (!note) return res.status(404).json({ message: "Note not found." });

  const result = await askGemini(summaryPrompt({ subject, mood, text: note.extractedText }), schemas.summary);
  note.summary = result;
  await note.save();
  res.json({ result });
}

export async function flashcards(req, res) {
  const { noteId, subject, mood, count } = req.body;
  const note = await Note.findOne({ _id: noteId, user: req.userId });
  if (!note) return res.status(404).json({ message: "Note not found." });

  const result = await askGemini(flashcardPrompt({ subject, mood, text: note.extractedText, count }), schemas.flashcards);
  res.json(result);
}

export async function quiz(req, res) {
  const { noteId, subject, topic, mood, difficulty, count } = req.body;
  let text = "";
  if (noteId) {
    const note = await Note.findOne({ _id: noteId, user: req.userId });
    if (note) text = note.extractedText;
  }

  const result = await askGemini(quizPrompt({ subject, topic, mood, text, difficulty, count }), schemas.quiz);
  res.json(validateQuiz(result));
}

export async function explanation(req, res) {
  const result = await askGemini(explanationPrompt(req.body), schemas.explanation);
  res.json(result);
}

export async function mockFeedback(req, res) {
  const result = await askGemini(mockFeedbackPrompt(req.body), schemas.feedback);
  res.json(result);
}
