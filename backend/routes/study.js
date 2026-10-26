import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { create, list } from "../controllers/study.js";

const router = Router();
router.use(auth);
router.post("/sessions", create);
router.get("/sessions", list);
export default router;
