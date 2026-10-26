import { getMoodConfig } from "./moods.js";

const safe = (value, max = 6000) => String(value ?? "").slice(0, max);

export function studyPlanPrompt({ subject, topics, examDate, availableMinutes, mood, difficulty, history }) {
  const m = getMoodConfig(mood);
  return `You are MoodBoard, an adaptive study planner.
Create a practical study plan, not a generic essay.

Study state:
- Mood: ${m.label}
- Mood behavior: ${m.description}
- Study block target: ${m.studyMinutes} minutes
- Break target: ${m.breakMinutes} minutes
- Preferred difficulty: ${m.difficulty}
- Technique: ${m.technique}
- Content style: ${m.content}

Student context:
Subject: ${safe(subject, 120)}
Topics: ${safe(topics, 2500)}
Exam date: ${safe(examDate, 80)}
Available time: ${Number(availableMinutes)} minutes
Difficulty preference: ${safe(difficulty, 80)}
Previous performance/history: ${safe(history, 2500)}

Rules:
- Fit the plan inside available time.
- Let mood materially change duration, activity type and difficulty.
- Exam Tomorrow prioritizes high-value revision, MCQs and mock-test style practice.
- Sleepy uses short visual/simple activities and frequent breaks.
- Stressed progresses easy to difficult and includes calming breaks.
- Focused uses longer deep-work blocks and challenging practice.
- Relaxed uses normal paced exploration.
- Avoid medical/mental-health claims.
- Return only the requested JSON structure.`;
}

export function summaryPrompt({ subject, mood, text }) {
  const m = getMoodConfig(mood);
  return `Create a ${m.content} study summary for ${safe(subject, 120)}.
Mood state: ${m.label}. Use the mood behavior: ${m.description}.
Source material:
${safe(text, 18000)}

Return concise, exam-useful content. Do not invent facts not supported by the source.`;
}

export function flashcardPrompt({ subject, mood, text, count = 10 }) {
  const m = getMoodConfig(mood);
  return `Create ${Math.min(Number(count), 30)} useful flashcards from the source material for ${safe(subject, 120)}.
Mood: ${m.label}; difficulty: ${m.difficulty}; style: ${m.content}.
Use only supported facts.
Source:
${safe(text, 18000)}`;
}

export function quizPrompt({ subject, topic, mood, text, difficulty, count = 10 }) {
  const m = getMoodConfig(mood);
  return `Create ${Math.min(Number(count), 20)} multiple-choice questions for ${safe(subject, 120)}.
Topic: ${safe(topic, 500)}
Mood: ${m.label}. Preferred mood difficulty: ${m.difficulty}.
Requested difficulty: ${safe(difficulty, 40)}
If mood is Sleepy, favor fewer and easier questions. If Focused, make them challenging. If Exam Tomorrow, make them exam-style.
Source material (if supplied):
${safe(text, 18000)}
Every question must have exactly 4 options, one correct answer index, and a short explanation.`;
}

export function explanationPrompt({ subject, topic, mood, question, context }) {
  const m = getMoodConfig(mood);
  return `Explain this ${safe(subject, 120)} concept to a student in a ${m.content} style.
Mood: ${m.label}.
Topic: ${safe(topic, 300)}
Question/concept: ${safe(question, 1200)}
Context: ${safe(context, 5000)}
Give an actionable explanation with one example when supported.`;
}

export function mockFeedbackPrompt({ subject, mood, results }) {
  return `Analyze this mock-test result for ${safe(subject, 120)}.
Mood: ${getMoodConfig(mood).label}
Results:
${safe(JSON.stringify(results), 9000)}
Identify weak topics, what to revise next, and a short next-session recommendation.`;
}

export const schemas = {
  plan: {
    type: "object",
    properties: {
      message: { type: "string" },
      priority: { type: "string", enum: ["low", "medium", "high"] },
      totalMinutes: { type: "integer" },
      recommendedTechnique: { type: "string" },
      sessions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["study", "break", "quiz", "mock"] },
            topic: { type: "string" },
            duration: { type: "integer" },
            activity: { type: "string" }
          },
          required: ["type", "topic", "duration", "activity"]
        }
      }
    },
    required: ["message", "priority", "totalMinutes", "recommendedTechnique", "sessions"]
  },
  summary: {
    type: "object",
    properties: {
      summary: { type: "string" },
      keyConcepts: { type: "array", items: { type: "string" } },
      definitions: { type: "array", items: { type: "string" } },
      formulas: { type: "array", items: { type: "string" } },
      examPoints: { type: "array", items: { type: "string" } },
      questions: { type: "array", items: { type: "string" } }
    },
    required: ["summary", "keyConcepts", "definitions", "formulas", "examPoints", "questions"]
  },
  flashcards: {
    type: "object",
    properties: {
      cards: {
        type: "array",
        items: {
          type: "object",
          properties: {
            front: { type: "string" },
            back: { type: "string" }
          },
          required: ["front", "back"]
        }
      }
    },
    required: ["cards"]
  },
  quiz: {
    type: "object",
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            correctIndex: { type: "integer" },
            explanation: { type: "string" },
            topic: { type: "string" }
          },
          required: ["question", "options", "correctIndex", "explanation", "topic"]
        }
      }
    },
    required: ["questions"]
  },
  explanation: {
    type: "object",
    properties: {
      explanation: { type: "string" },
      example: { type: "string" },
      quickCheck: { type: "string" }
    },
    required: ["explanation", "example", "quickCheck"]
  },
  feedback: {
    type: "object",
    properties: {
      feedback: { type: "string" },
      weakTopics: { type: "array", items: { type: "string" } },
      nextSteps: { type: "array", items: { type: "string" } }
    },
    required: ["feedback", "weakTopics", "nextSteps"]
  }
};
