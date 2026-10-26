import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { studyPlan, summary, flashcards, quiz, explanation, mockFeedback } from "../controllers/ai.js";

const router = Router();
router.use(auth);
router.post("/study-plan", studyPlan);
router.post("/summary", summary);
router.post("/flashcards", flashcards);
router.post("/quiz", quiz);
router.post("/explanation", explanation);
router.post("/mock-test-feedback", mockFeedback);
export default router;
