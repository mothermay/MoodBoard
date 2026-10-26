import { createContext, useContext, useEffect, useState } from "react";

export const moods = {
  sleepy: { label: "Sleepy", emoji: "😴", description: "Short, visual study", study: 15, break: 5 },
  stressed: { label: "Stressed", emoji: "😰", description: "Calm, guided progression", study: 25, break: 5 },
  focused: { label: "Focused", emoji: "🎯", description: "Deep work and challenge", study: 50, break: 10 },
  exam: { label: "Exam Tomorrow", emoji: "🚨", description: "High-value revision", study: 25, break: 5 },
  relaxed: { label: "Relaxed", emoji: "😌", description: "Normal pace and exploration", study: 30, break: 5 }
};

const MoodContext = createContext(null);

export function MoodProvider({ children }) {
  const [mood, setMood] = useState(localStorage.getItem("moodboard_mood") || "relaxed");

  useEffect(() => localStorage.setItem("moodboard_mood", mood), [mood]);

  return <MoodContext.Provider value={{ mood, setMood, config: moods[mood] || moods.relaxed }}>
    {children}
  </MoodContext.Provider>;
}

export const useMood = () => useContext(MoodContext);
