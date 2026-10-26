import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function tokenFor(user) {
  return jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    studyPreferences: user.studyPreferences,
    subjects: user.subjects,
    stats: user.stats,
    createdAt: user.createdAt
  };
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: "Name, email and a 6+ character password are required." });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: "An account with that email already exists." });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), passwordHash });

  res.status(201).json({ token: tokenFor(user), user: safeUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || "").toLowerCase() });

  if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({ token: tokenFor(user), user: safeUser(user) });
}

export async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user: safeUser(user) });
}
