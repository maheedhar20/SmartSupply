import mongoose, { Document } from 'mongoose';

export interface IBidRequest extends Document {
  warehouseId: mongoose.Types.ObjectId;
  productName: string;
  category: string;
  quantity: number;
  specifications: {
    description: string;
    customRequirements?: string;
    qualityStandards?: string;
    packagingRequirements?: string;
    deliveryLocation: {
      address: string;
      city: string;
      state: string;
      latitude: number;
      longitude: number;
    };
  };
  budget: {
    minPrice: number;
    maxPrice: number;
    preferredPrice: number;
  };
  timeline: {
    requestedDeliveryDate: Date;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
  };
  bidRequirements: {
    minimumFactoryRating?: number;
    preferredMaxDistance?: number;
    requiresCertifications?: string[];
    paymentTerms?: string;
  };
  status: 'open' | 'closed' | 'awarded' | 'cancelled';
  biddingDeadline: Date;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BidRequestSchema = new mongoose.Schema({
  warehouseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productName: { 
    type: String, 
    required: true,
    trim: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1 
  },
  specifications: {
    description: { 
      type: String, 
      required: true 
    },
    customRequirements: String,
    qualityStandards: String,
    packagingRequirements: String,
    deliveryLocation: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  budget: {
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    preferredPrice: { type: Number, required: true }
  },
  timeline: {
    requestedDeliveryDate: { type: Date, required: true },
    urgency: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium' 
    }
  },
  bidRequirements: {
    minimumFactoryRating: { type: Number, min: 1, max: 5 },
    preferredMaxDistance: { type: Number },
    requiresCertifications: [String],
    paymentTerms: String
  },
  status: { 
    type: String, 
    enum: ['open', 'closed', 'awarded', 'cancelled'],
    default: 'open' 
  },
  biddingDeadline: { type: Date, required: true },
  notes: String,
  attachments: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient querying
BidRequestSchema.index({ category: 1, status: 1 });
BidRequestSchema.index({ biddingDeadline: 1 });
BidRequestSchema.index({ 'specifications.deliveryLocation.latitude': 1, 'specifications.deliveryLocation.longitude': 1 });

export default mongoose.model<IBidRequest>('BidRequest', BidRequestSchema);