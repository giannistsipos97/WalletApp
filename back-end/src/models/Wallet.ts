import { Schema, model, Document } from "mongoose";

// 2. Transaction Schema
const transactionSchema = new Schema({
  accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  note: String,
  date: { type: Date, default: Date.now },
});

export const Transaction = model("Transaction", transactionSchema);
