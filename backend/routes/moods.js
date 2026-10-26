import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { list } from "../controllers/moods.js";

const router = Router();
router.get("/", auth, list);
export default router;
