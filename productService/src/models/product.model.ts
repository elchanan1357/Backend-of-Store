import mongoose, { Schema, Document } from 'mongoose';
import { ProductCategory } from '../types/product';
import { Product } from '../types/product';

export interface IProduct extends Product, Document<Schema.Types.ObjectId> {}

const ProductSchema: Schema = new Schema({
  mkt: { type: String, required: true, unique: true },
  img: { type: String },
  logo: {type: String},
  name: { type: String, required: true },
  company: {type: String},
  color: {type: String},
  description: { type: String },
  price: { type: String, required: true },
  category: { type: String, enum: Object.values(ProductCategory), required: true },
  stock: { type: Number, required: true, min: 0 },
});

export type ProductSelect = Partial<Record<keyof IProduct, number>>;

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
