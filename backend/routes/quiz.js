import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { save, list } from "../controllers/quiz.js";

const router = Router();
router.use(auth);
router.post("/results", save);
router.get("/results", list);
export default router;
