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
