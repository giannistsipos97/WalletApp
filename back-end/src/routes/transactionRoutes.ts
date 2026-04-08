import { Request, Response, Router } from "express";
import { Transaction } from "../models/Transaction";
import { Account } from "../models/Account";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { userId, accountId, amount, type, description, category, date } =
    req.body;

  try {
    // 1. Save Transaction
    let transaction = new Transaction({
      userId,
      accountId,
      amount,
      type,
      description,
      category: category._id,
      date,
    });

    await transaction.save();

    // 2. Populate for the frontend
    transaction = await transaction.populate("category");

    // 3. Update Account
    const change = type === "expense" ? -amount : amount;
    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { $inc: { balance: change } },
      { new: true },
    );

    res.status(201).json({ transaction, account: updatedAccount });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

export default router;
