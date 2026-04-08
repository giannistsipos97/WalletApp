import { model, Schema } from "mongoose";

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  // Reference allows for .populate()
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  description: String,
  date: { type: Date, default: Date.now },
});

export const Transaction = model("Transaction", transactionSchema);
