import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Plus, Clock, Package, DollarSign, Users, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { api } from '../utils/api.ts';

interface BidRequest {
  _id: string;
  warehouseId: {
    _id: string;
    name: string;
    location: {
      address: string;
      city: string;
      state: string;
    };
  };
  productName: string;
  category: string;
  quantity: number;
  budget: {
    minPrice: number;
    maxPrice: number;
    preferredPrice: number;
  };
  timeline: {
    requestedDeliveryDate: string;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
  };
  biddingDeadline: string;
  status: 'open' | 'closed' | 'awarded' | 'cancelled';
  bidCount?: number;
  createdAt: string;
}

const BiddingPage: React.FC = () => {
  const { user } = useAuth();
  const [bidRequests, setBidRequests] = useState<BidRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    category: '',
    urgency: '',
    search: ''
  });

  useEffect(() => {
    fetchBidRequests();
  }, []);

  const fetchBidRequests = async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === 'warehouse' ? 'bidding/my-requests' : 'bidding/requests';
      const response = await api.get(endpoint);
      setBidRequests(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bid requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = bidRequests.filter(request => {
    const matchesCategory = !filter.category || request.category === filter.category;
    const matchesUrgency = !filter.urgency || request.timeline.urgency === filter.urgency;
    const matchesSearch = !filter.search || 
      request.productName.toLowerCase().includes(filter.search.toLowerCase()) ||
      request.warehouseId.name.toLowerCase().includes(filter.search.toLowerCase());
    
    return matchesCategory && matchesUrgency && matchesSearch;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'awarded': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    'Food & Beverages',
    'Electronics',
    'Automotive',
    'Textiles',
    'Chemicals',
    'Construction Materials',
    'Machinery',
    'Packaging',
    'Other'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bid requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Gavel className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.role === 'warehouse' ? 'My Bid Requests' : 'Available Bid Requests'}
                </h1>
                <p className="text-gray-600">
                  {user?.role === 'warehouse' 
                    ? 'Manage your bid requests and review received bids'
                    : 'Submit competitive bids for warehouse requirements'
                  }
                </p>
              </div>
            </div>
            
            {user?.role === 'warehouse' && (
              <Link
                to="/bidding/create"
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Bid Request
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search products or warehouses..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency
              </label>
              <select
                value={filter.urgency}
                onChange={(e) => setFilter(prev => ({ ...prev, urgency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Urgency Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilter({ category: '', urgency: '', search: '' })}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Bid Requests Grid */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {bidRequests.length === 0 ? 'No bid requests found' : 'No matching requests'}
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'warehouse' 
                ? 'Create your first bid request to start receiving competitive proposals from factories.'
                : 'Check back later for new bid opportunities from warehouses.'
              }
            </p>
            {user?.role === 'warehouse' && bidRequests.length === 0 && (
              <Link
                to="/bidding/create"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Bid Request
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {request.productName}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">{request.category}</span>
                        <span className="text-gray-300">•</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(request.timeline.urgency)}`}>
                          {request.timeline.urgency.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>Quantity: {request.quantity.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        Budget: ₹{request.budget.minPrice.toLocaleString()} - ₹{request.budget.maxPrice.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        Deadline: {new Date(request.biddingDeadline).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {user?.role === 'warehouse' && request.bidCount !== undefined && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{request.bidCount} bid{request.bidCount !== 1 ? 's' : ''} received</span>
                      </div>
                    )}
                  </div>

                  {/* Warehouse Info (for factories) */}
                  {user?.role === 'factory' && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Warehouse</h4>
                      <p className="text-sm text-gray-600">{request.warehouseId.name}</p>
                      <p className="text-xs text-gray-500">
                        {request.warehouseId.location.city}, {request.warehouseId.location.state}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    to={user?.role === 'warehouse' 
                      ? `/bidding/requests/${request._id}` 
                      : `/bidding/requests/${request._id}/submit-bid`
                    }
                    className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block"
                  >
                    {user?.role === 'warehouse' ? 'View Bids' : 'Submit Bid'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BiddingPage;