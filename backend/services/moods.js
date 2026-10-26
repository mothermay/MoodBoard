export const MOODS = {
  sleepy: {
    label: "Sleepy",
    emoji: "😴",
    description: "Low-energy, short and visual study",
    studyMinutes: 15,
    breakMinutes: 5,
    difficulty: "easy",
    technique: "micro-learning",
    content: "concise, visual, simple",
    music: "light instrumental"
  },
  stressed: {
    label: "Stressed",
    emoji: "😰",
    description: "Calm, reassuring, step-by-step study",
    studyMinutes: 25,
    breakMinutes: 5,
    difficulty: "easy-to-medium",
    technique: "guided progression",
    content: "simple and reassuring",
    music: "calming ambient"
  },
  focused: {
    label: "Focused",
    emoji: "🎯",
    description: "Deep work and challenging practice",
    studyMinutes: 50,
    breakMinutes: 10,
    difficulty: "hard",
    technique: "deep work",
    content: "detailed and advanced",
    music: "deep focus instrumental"
  },
  exam: {
    label: "Exam Tomorrow",
    emoji: "🚨",
    description: "High-value revision and exam practice",
    studyMinutes: 25,
    breakMinutes: 5,
    difficulty: "exam-style",
    technique: "rapid revision",
    content: "high-yield and concise",
    music: "minimal-distraction study"
  },
  relaxed: {
    label: "Relaxed",
    emoji: "😌",
    description: "Normal pace with room to explore",
    studyMinutes: 30,
    breakMinutes: 5,
    difficulty: "medium",
    technique: "normal pomodoro",
    content: "balanced and exploratory",
    music: "ambient chill"
  }
};

export function getMoodConfig(key) {
  return MOODS[key] || MOODS.relaxed;
}
