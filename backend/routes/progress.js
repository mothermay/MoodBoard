import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getProgress } from "../controllers/progress.js";

const router = Router();
router.get("/", auth, getProgress);
export default router;
