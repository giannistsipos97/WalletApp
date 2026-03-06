import { Schema, model } from "mongoose";

const accountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    color: {
      type: String,
      default: "bg-indigo-600", // We store Tailwind classes directly!
    },
  },
  {
    timestamps: true, // This automatically adds 'createdAt' and 'updatedAt'
  },
);

export const Account = model("Account", accountSchema);
