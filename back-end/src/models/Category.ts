import { model, Schema } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  color: {
    type: String,
    default: "text-slate-500",
  },
});

export const Category = model("Category", CategorySchema);
