export interface User {
  id: string;
  email: string;
  role: 'warehouse' | 'factory';
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  phone?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  specifications: {
    weight?: number;
    dimensions?: string;
    material?: string;
    customFields?: Record<string, any>;
  };
  factoryId: string | Factory;
  pricePerUnit: number;
  minimumOrder: number;
  availableQuantity: number;
  productionTimeInDays: number;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Factory {
  _id: string;
  email: string;
  role: 'factory';
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  phone?: string;
  products?: Product[];
  productCount?: number;
}

export interface Order {
  _id: string;
  warehouseId: string | User;
  factoryId: string | User;
  productId: string | Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'in_production' | 'completed' | 'cancelled';
  requestedDeliveryDate?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  factoryResponse?: {
    message: string;
    counterOffer?: {
      price: number;
      deliveryDate: string;
    };
    respondedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  product: Product;
  factory: {
    id: string;
    name: string;
    location: {
      address: string;
      latitude: number;
      longitude: number;
    };
  };
  distance: number;
  totalPrice: number;
  smartScore: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'warehouse' | 'factory';
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  phone?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message: string;
  error?: string;
}

export interface BidRequest {
  _id: string;
  warehouseId: string | User;
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
    requestedDeliveryDate: string;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
  };
  bidRequirements: {
    minimumFactoryRating?: number;
    preferredMaxDistance?: number;
    requiresCertifications?: string[];
    paymentTerms?: string;
  };
  status: 'open' | 'closed' | 'awarded' | 'cancelled';
  biddingDeadline: string;
  notes?: string;
  attachments?: string[];
  bidCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  _id: string;
  bidRequestId: string | BidRequest;
  factoryId: string | User;
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
    estimatedDeliveryDate: string;
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
  submittedAt: string;
  updatedAt: string;
  validUntil: string;
}
