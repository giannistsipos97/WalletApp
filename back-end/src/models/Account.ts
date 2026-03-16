import { model, Schema } from "mongoose";

const accountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    balance: { type: Number, required: true, default: 0 },
    color: { type: String, default: "bg-indigo-600" },
  },
  { timestamps: true },
);

export const Account = model("Account", accountSchema);
