import { Response } from "express";
import { Account } from "../models/Account";
import { Transaction } from "../models/Transaction";

export const createTransaction = async (req: any, res: Response) => {
  try {
    const { accountId, amount, category, type, note, date } = req.body;

    const transaction = new Transaction({
      userId: req.user.id,
      accountId,
      amount,
      category,
      type,
      note,
      date: date || new Date(),
    });

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    if (type === "income") {
      account.balance += amount;
    } else if (type === "expense") {
      account.balance -= amount;
    }

    await account.save();
    await transaction.save();
    res.status(201).json({ transaction, newBalance: account.balance });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error processing transaction", error: error.message });
  }
};
