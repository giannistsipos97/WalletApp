import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";

const app = express();

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Simple test route
app.get("/", (req, res) => {
  res.send("Wallet API is running and connected to Atlas!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is vibrating on port ${PORT}`);
});
