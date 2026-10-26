import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MoodProvider } from "./context/MoodContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Session from "./pages/Session";
import Notes from "./pages/Notes";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";
import MoodHistory from "./pages/MoodHistory";
import Profile from "./pages/Profile";

export default function App() {
  return <AuthProvider><MoodProvider><BrowserRouter><Routes>
    <Route path="/" element={<Landing/>}/>
    <Route path="/login" element={<Auth mode="login"/>}/>
    <Route path="/register" element={<Auth mode="register"/>}/>
    <Route element={<ProtectedRoute/>}><Route element={<Layout/>}>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/planner" element={<Planner/>}/>
      <Route path="/session" element={<Session/>}/>
      <Route path="/notes" element={<Notes/>}/>
      <Route path="/flashcards" element={<Flashcards/>}/>
      <Route path="/quiz" element={<Quiz/>}/>
      <Route path="/progress" element={<Progress/>}/>
      <Route path="/moods" element={<MoodHistory/>}/>
      <Route path="/profile" element={<Profile/>}/>
    </Route></Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></BrowserRouter></MoodProvider></AuthProvider>;
}
