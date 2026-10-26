import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import Note from "../models/Note.js";
import { extractText } from "../services/extract.js";

const uploadDir = path.resolve("uploads");

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}-${path.extname(file.originalname).toLowerCase()}`)
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".docx", ".pptx"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
}).single("file");

export async function upload(req, res) {
  if (!req.file) return res.status(400).json({ message: "Upload a PDF, DOCX or PPTX file up to 10MB." });

  try {
    const extractedText = await extractText(req.file.path, req.file.mimetype);
    if (!extractedText) throw new Error("No readable text was found in the document.");

    const note = await Note.create({
      user: req.userId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      extractedText
    });

    res.status(201).json({
      note: {
        id: note._id,
        originalName: note.originalName,
        size: note.size,
        createdAt: note.createdAt,
        textPreview: extractedText.slice(0, 500)
      }
    });
  } catch (err) {
    await fs.unlink(req.file.path).catch(() => {});
    res.status(400).json({ message: err.message || "Could not process the document." });
  }
}

export async function list(req, res) {
  const notes = await Note.find({ user: req.userId })
    .select("originalName size createdAt summary")
    .sort({ createdAt: -1 });
  res.json({ notes });
}

export async function getOne(req, res) {
  const note = await Note.findOne({ _id: req.params.id, user: req.userId });
  if (!note) return res.status(404).json({ message: "Note not found." });
  res.json({ note });
}

export async function remove(req, res) {
  const note = await Note.findOne({ _id: req.params.id, user: req.userId });
  if (!note) return res.status(404).json({ message: "Note not found." });

  await fs.unlink(path.join(uploadDir, note.filename)).catch(() => {});
  await note.deleteOne();
  res.json({ message: "Note deleted." });
}
