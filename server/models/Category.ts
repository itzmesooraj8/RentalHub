import mongoose, { Schema, Model } from 'mongoose';

export interface ICategory {
  id: string;
  industry: string;
  category: string;
  subcategories: string[];
  attributes: { name: string; type: 'string' | 'number' | 'select'; required: boolean; options?: string[] }[];
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: String, required: true, unique: true, index: true },
    industry: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    subcategories: [{ type: String }],
    attributes: [
      {
        name: { type: String, required: true },
        type: { type: String, enum: ['string', 'number', 'select'], default: 'string' },
        required: { type: Boolean, default: false },
        options: [{ type: String }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CategoryModel: Model<ICategory> =
  (mongoose.models.Category as Model<ICategory>) || mongoose.model<ICategory>('Category', CategorySchema);
