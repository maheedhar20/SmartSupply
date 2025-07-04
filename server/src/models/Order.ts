import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  warehouseId: mongoose.Types.ObjectId;
  factoryId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'in_production' | 'completed' | 'cancelled';
  requestedDeliveryDate?: Date;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  factoryResponse?: {
    message: string;
    counterOffer?: {
      price: number;
      deliveryDate: Date;
    };
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  warehouseId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  factoryId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_production', 'completed', 'cancelled'],
    default: 'pending',
  },
  requestedDeliveryDate: Date,
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  notes: String,
  factoryResponse: {
    message: String,
    counterOffer: {
      price: Number,
      deliveryDate: Date,
    },
    respondedAt: Date,
  },
}, {
  timestamps: true,
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
