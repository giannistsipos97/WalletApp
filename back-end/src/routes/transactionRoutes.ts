import { Request, Response, Router } from "express";
import { Transaction } from "../models/Transaction";
import { Account } from "../models/Account";

const router = Router();

//POST method for creating a transaction
router.post("/", async (req: Request, res: Response) => {
  const { userId, accountId, amount, type, description, category, date } = req.body;

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
    const updatedAccount = await Account.findByIdAndUpdate(accountId, { $inc: { balance: change } }, { new: true });

    res.status(201).json({ transaction, account: updatedAccount });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

//PUT method for updating a transaction
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, type, description, category, date } = req.body;

  try {
    // 1. Find the old transaction first to see the previous balance impact
    const oldTransaction = await Transaction.findById(id);
    if (!oldTransaction) return res.status(404).json({ message: "Transaction not found" });

    // 2. Calculate the Balance Adjustment
    const oldImpact = oldTransaction.type === "expense" ? -oldTransaction.amount : oldTransaction.amount;
    const newImpact = type === "expense" ? -amount : amount;
    const balanceAdjustment = newImpact - oldImpact;

    // 3. Update the Transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, type, description, category: category._id || category, date },
      { new: true },
    ).populate("category");

    // 4. Update the Account balance if the amount/type changed
    let updatedAccount = null;

    if (balanceAdjustment !== 0) {
      // Line below is where the error likely is
      updatedAccount = await Account.findByIdAndUpdate(oldTransaction.accountId, { $inc: { balance: balanceAdjustment } }, { new: true });
    } else {
      // As we discussed, fetch current account if no change
      updatedAccount = await Account.findById(oldTransaction.accountId);
    }

    res.json({ transaction: updatedTransaction, account: updatedAccount });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

export default router;
