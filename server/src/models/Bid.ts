import mongoose, { Document } from 'mongoose';

export interface IBid extends Document {
  bidRequestId: mongoose.Types.ObjectId;
  factoryId: mongoose.Types.ObjectId;
  pricing: {
    unitPrice: number;
    totalPrice: number;
    priceBreakdown?: {
      materialCost?: number;
      laborCost?: number;
      overheadCost?: number;
      margin?: number;
    };
    discountOffered?: number;
    paymentTerms: string;
  };
  delivery: {
    estimatedDeliveryDate: Date;
    deliveryMethod: string;
    shippingCost: number;
    productionTimeInDays: number;
  };
  qualityAssurance: {
    certifications: string[];
    qualityGuarantee: string;
    warrantyCoverage?: string;
    sampleAvailable: boolean;
  };
  factoryCapacity: {
    currentCapacity: number;
    maxCapacity: number;
    experienceYears: number;
    similarProjectsCompleted: number;
  };
  proposal: {
    message: string;
    alternativeSpecs?: string;
    valueProposition: string;
    riskMitigation?: string;
  };
  status: 'submitted' | 'withdrawn' | 'accepted' | 'rejected' | 'counter_offered';
  competitiveAdvantages?: string[];
  attachments?: string[];
  submittedAt: Date;
  updatedAt: Date;
  validUntil: Date;
}

const BidSchema = new mongoose.Schema({
  bidRequestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BidRequest', 
    required: true 
  },
  factoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  pricing: {
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    priceBreakdown: {
      materialCost: Number,
      laborCost: Number,
      overheadCost: Number,
      margin: Number
    },
    discountOffered: { type: Number, default: 0 },
    paymentTerms: { type: String, required: true }
  },
  delivery: {
    estimatedDeliveryDate: { type: Date, required: true },
    deliveryMethod: { type: String, required: true },
    shippingCost: { type: Number, required: true },
    productionTimeInDays: { type: Number, required: true }
  },
  qualityAssurance: {
    certifications: [String],
    qualityGuarantee: { type: String, required: true },
    warrantyCoverage: String,
    sampleAvailable: { type: Boolean, default: false }
  },
  factoryCapacity: {
    currentCapacity: { type: Number, required: true },
    maxCapacity: { type: Number, required: true },
    experienceYears: { type: Number, required: true },
    similarProjectsCompleted: { type: Number, default: 0 }
  },
  proposal: {
    message: { type: String, required: true },
    alternativeSpecs: String,
    valueProposition: { type: String, required: true },
    riskMitigation: String
  },
  status: { 
    type: String, 
    enum: ['submitted', 'withdrawn', 'accepted', 'rejected', 'counter_offered'],
    default: 'submitted' 
  },
  competitiveAdvantages: [String],
  attachments: [String],
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true }
});

// Indexes for efficient querying
BidSchema.index({ bidRequestId: 1, factoryId: 1 }, { unique: true });
BidSchema.index({ factoryId: 1, status: 1 });
BidSchema.index({ 'pricing.totalPrice': 1 });
BidSchema.index({ validUntil: 1 });

export default mongoose.model<IBid>('Bid', BidSchema);