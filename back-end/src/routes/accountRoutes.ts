import { Router } from "express";
import { createAccount, getAccounts } from "../controllers/accountController";
import { authMiddleware } from "../middleware/auth"; // Ensure this path is correct

const router = Router();

router.post("/", authMiddleware, createAccount);
router.get("/", authMiddleware, getAccounts);

export default router;
