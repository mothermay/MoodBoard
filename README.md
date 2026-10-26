# MoodBoard

MoodBoard is an AI-powered adaptive study platform. It changes study duration, content difficulty, recommendations, quizzes, summaries, and the study atmosphere according to the student's selected study state.

## Simple architecture

```text
moodboard/
  frontend/     React + Vite
  backend/      Express + MongoDB + Gemini
  README.md
  .gitignore
```

MongoDB and uploaded files are local. Gemini is called only by the backend.

## Requirements

- Node.js 18+
- MongoDB running locally
- A Gemini API key

## 1. Backend

```bash
cd backend
npm install
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env`.

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/moodboard
JWT_SECRET=change-this-local-secret
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend: http://localhost:5000

## 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## 3. MongoDB

Use a local MongoDB installation/service. No cloud database is required.

The application creates the `moodboard` database automatically when the first request is made.

## Main features

- JWT register/login/logout
- Mood-driven adaptive study configuration
- Gemini study plans and recommendations
- Smart Pomodoro
- Local PDF/DOCX/PPT/PPTX note uploads
- AI summaries
- AI flashcards
- AI MCQ quizzes
- Timed mock-test foundation
- Quiz/result persistence
- Study sessions and streaks
- Progress charts
- Mood history
- Local profile/settings
- Optional legal YouTube/Spotify embeds
- Responsive mobile navigation
- Loading, empty, success and error states

## API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### AI
- `POST /api/ai/study-plan`
- `POST /api/ai/summary`
- `POST /api/ai/flashcards`
- `POST /api/ai/quiz`
- `POST /api/ai/explanation`
- `POST /api/ai/mock-test-feedback`

### Notes
- `POST /api/notes/upload`
- `GET /api/notes`
- `GET /api/notes/:id`
- `DELETE /api/notes/:id`

### Study
- `POST /api/study/sessions`
- `GET /api/study/sessions`

### Quiz / progress
- `POST /api/quiz/results`
- `GET /api/quiz/results`
- `GET /api/progress`
- `GET /api/moods`

## Demo flow

1. Register.
2. Open Planner.
3. Pick `Exam Tomorrow`, a subject, topics, tomorrow's date and 2 hours.
4. Generate the real Gemini study plan.
5. Start the configured Pomodoro.
6. Upload notes.
7. Generate a summary, flashcards and quiz.
8. Complete the quiz.
9. Open Progress and Mood History.

## Security

- Passwords are bcrypt hashes.
- JWT protects private routes.
- Gemini key stays in `backend/.env`.
- `.env` and `uploads/` are ignored by Git.
- Upload size/type validation is enabled.
- AI output is parsed and validated before being returned.
- API errors do not expose stack traces.

## Notes

This project intentionally avoids a complicated architecture. The frontend has pages/components/services, while the backend uses routes/controllers/models/services. It is designed to be understandable for a college Advanced Web Technology project.

The app treats mood as a study-state preference, not a medical or psychological diagnosis.
