import mongoose, { Schema, Model } from 'mongoose';
import { Category } from '../../src/types';

const CategorySchema = new Schema<Category>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String },
    itemCount: { type: Number, default: 0 },
    industry: { type: String, default: 'General' },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel: Model<Category> =
  (mongoose.models.Category as Model<Category>) || mongoose.model<Category>('Category', CategorySchema);
