import { Request, Response } from "express";
import { Account } from "../models/Account";

export const createAccount = async (req: any, res: Response) => {
  try {
    const { name, balance, color } = req.body;

    const account = new Account({
      userId: req.user.id,
      name,
      balance,
      color,
    });

    await account.save();
    res.status(201).json(account);
  } catch (error: any) {
    res.status(500).json({
      message: "Server error creating account",
      error: error.message, // This sends the reason back to Postman!
    });
  }
};

export const getAccounts = async (req: any, res: Response) => {
  try {
    // Only find accounts belonging to THIS user
    const accounts = await Account.find({ userId: req.user.id });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching accounts" });
  }
};
