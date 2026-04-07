import { Request, Response, Router } from "express";
import { Category } from "../models/Category";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
