import { Router } from "express";
import { createTransaction } from "../controllers/transactionController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, createTransaction);

export default router;
