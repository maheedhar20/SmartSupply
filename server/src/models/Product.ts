import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  specifications: {
    weight?: number;
    dimensions?: string;
    material?: string;
    customFields?: Record<string, any>;
  };
  factoryId: mongoose.Types.ObjectId;
  pricePerUnit: number;
  minimumOrder: number;
  availableQuantity: number;
  productionTimeInDays: number;
  images?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  specifications: {
    weight: Number,
    dimensions: String,
    material: String,
    customFields: Schema.Types.Mixed,
  },
  factoryId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  minimumOrder: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  productionTimeInDays: {
    type: Number,
    required: true,
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
