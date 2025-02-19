import mongoose, { Schema, Document } from 'mongoose';
import { ProductCategory } from '../types/product';
import { Product } from '../types/product';

export interface IProduct extends Product, Document<Schema.Types.ObjectId> {}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  img: { type: String },
  price: { type: Number, required: true, min: 0 },
  mkt: { type: String, required: true, unique: true },
  category: { type: String, enum: Object.values(ProductCategory), required: true },
  stock: { type: Number, required: true, min: 0 },
});

export type ProductSelect = Partial<Record<keyof IProduct, number>>;

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
