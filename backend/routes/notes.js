import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { uploadMiddleware, upload, list, getOne, remove } from "../controllers/notes.js";

const router = Router();
router.use(auth);
router.post("/upload", uploadMiddleware, upload);
router.get("/", list);
router.get("/:id", getOne);
router.delete("/:id", remove);
export default router;
