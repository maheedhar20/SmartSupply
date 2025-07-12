import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { api } from '../utils/api.ts';

const CreateBidRequest: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Electronics',
    quantity: 1,
    specifications: {
      description: '',
      customRequirements: '',
      qualityStandards: '',
      packagingRequirements: '',
      deliveryLocation: {
        address: '',
        city: '',
        state: '',
        latitude: 0,
        longitude: 0
      }
    },
    budget: {
      minPrice: 0,
      maxPrice: 0,
      preferredPrice: 0
    },
    timeline: {
      requestedDeliveryDate: '',
      urgency: 'medium'
    },
    bidRequirements: {
      minimumFactoryRating: 3,
      preferredMaxDistance: 500,
      requiresCertifications: [],
      paymentTerms: '30 days'
    },
    biddingDeadline: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.productName || !formData.specifications.description) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.specifications.deliveryLocation.address || 
          !formData.specifications.deliveryLocation.city || 
          !formData.specifications.deliveryLocation.state) {
        throw new Error('Please fill in all delivery location fields');
      }

      console.log('Submitting form data:', formData);
      await api.post('bidding/requests', formData);
      
      navigate('/bidding');
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create bid request');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'warehouse') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only warehouses can create bid requests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Bid Request</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description *
              </label>
              <textarea
                rows={4}
                value={formData.specifications.description}
                onChange={(e) => setFormData({
                  ...formData, 
                  specifications: {...formData.specifications, description: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe the product specifications, features, and requirements..."
                required
              />
            </div>

            {/* Delivery Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Location</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.specifications.deliveryLocation.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        deliveryLocation: {
                          ...formData.specifications.deliveryLocation,
                          address: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.specifications.deliveryLocation.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        deliveryLocation: {
                          ...formData.specifications.deliveryLocation,
                          city: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.specifications.deliveryLocation.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        deliveryLocation: {
                          ...formData.specifications.deliveryLocation,
                          state: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Range</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget.minPrice}
                    onChange={(e) => setFormData({
                      ...formData,
                      budget: {...formData.budget, minPrice: parseFloat(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget.preferredPrice}
                    onChange={(e) => setFormData({
                      ...formData,
                      budget: {...formData.budget, preferredPrice: parseFloat(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget.maxPrice}
                    onChange={(e) => setFormData({
                      ...formData,
                      budget: {...formData.budget, maxPrice: parseFloat(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bidding Deadline
                </label>
                <input
                  type="date"
                  value={formData.biddingDeadline}
                  onChange={(e) => setFormData({...formData, biddingDeadline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.timeline.requestedDeliveryDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    timeline: {...formData.timeline, requestedDeliveryDate: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Bid Request...' : 'Create Bid Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBidRequest;
