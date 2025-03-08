import mongoose, { Schema, Document } from 'mongoose';

export interface OrderItem {
  mkt: string;
  name: string;
  price: `₪${number}`; // string as support ₪ format
  quantity: number;
}

export interface IOrder extends Document {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: {
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      mkt: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    address: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IOrder>('Order', OrderSchema);