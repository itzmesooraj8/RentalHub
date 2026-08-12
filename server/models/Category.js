import mongoose, { Schema } from "mongoose";
const CategorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String },
    itemCount: { type: Number, default: 0 },
    industry: { type: String, default: "General" }
  },
  {
    timestamps: true
  }
);
export const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);
