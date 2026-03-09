import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// SIGNUP: Accessed at POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "SUPER_SECRET_KEY_CHANGEME",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during signup" });
  }
});

// LOGIN: Accessed at POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: foundUser._id },
      process.env.JWT_SECRET || "SUPER_SECRET_KEY_CHANGEME",
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: { id: foundUser._id, name: foundUser.name, email: foundUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

router.get("/me", authMiddleware, async (req: any, res) => {
  try {
    // The authMiddleware has already verified the token
    // and put the userId into req.user
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

export default router;
