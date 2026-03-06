import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { User } from "./models/User";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2. Compare the password with the hashed one in DB
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Create Token (Now foundUser._id exists!)
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

// SIGNUP ROUTE
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Create Token
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
