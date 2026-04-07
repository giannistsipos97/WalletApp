import { Request, Response, Router } from "express";
import { Transaction } from "../models/Transaction";
import { Account } from "../models/Account";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { accountId, amount, type, description, category } = req.body;

  try {
    const newTransaction = new Transaction({
      accountId,
      amount,
      type,
      description,
      category,
    });
    await newTransaction.save();

    // If expense, subtract. If income, add.
    const adjustment = type === "expense" ? -amount : amount;

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { $inc: { balance: adjustment } },
      { new: true },
    );

    res.status(201).json({
      message: "Transaction successful",
      account: updatedAccount,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
