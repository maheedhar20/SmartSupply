import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, DollarSign, MapPin, FileText, XCircle, Star } from 'lucide-react';
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
  specifications: {
    description: string;
    customRequirements?: string;
    qualityStandards?: string;
    packagingRequirements?: string;
    deliveryLocation: {
      address: string;
      city: string;
      state: string;
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
  biddingDeadline: string;
  status: 'open' | 'closed' | 'awarded' | 'cancelled';
  notes?: string;
  createdAt: string;
}

interface Bid {
  _id: string;
  factoryId: {
    _id: string;
    name: string;
    location: {
      address: string;
      city: string;
      state: string;
    };
  };
  pricing: {
    unitPrice: number;
    totalPrice: number;
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
    sampleAvailable: boolean;
  };
  proposal: {
    message: string;
    valueProposition: string;
  };
  status: 'submitted' | 'accepted' | 'rejected';
  submittedAt: string;
}

const BidRequestDetailsPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bidRequest, setBidRequest] = useState<BidRequest | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingBid, setAcceptingBid] = useState<string | null>(null);

  useEffect(() => {
    fetchBidRequestDetails();
    if (user?.role === 'warehouse') {
      fetchBids();
    }
  }, [requestId]);

  const fetchBidRequestDetails = async () => {
    try {
      const response = await api.get(`bidding/requests/${requestId}`);
      setBidRequest(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bid request details');
    }
  };

  const fetchBids = async () => {
    try {
      const response = await api.get(`bidding/requests/${requestId}/bids`);
      setBids(response.data);
    } catch (err: any) {
      console.error('Error fetching bids:', err);
    } finally {
      setLoading(false);
    }
  };

  const acceptBid = async (bidId: string) => {
    try {
      setAcceptingBid(bidId);
      await api.patch(`bidding/bids/${bidId}/accept`);
      
      // Refresh data
      await fetchBidRequestDetails();
      await fetchBids();
      
      // Show success message or redirect
      navigate('/bidding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept bid');
    } finally {
      setAcceptingBid(null);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bid request details...</p>
        </div>
      </div>
    );
  }

  if (error || !bidRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Bid request not found'}</p>
          <button
            onClick={() => navigate('/bidding')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Bidding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/bidding')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Bidding
          </button>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {bidRequest.productName}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{bidRequest.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(bidRequest.timeline.urgency)}`}>
                    {bidRequest.timeline.urgency.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Posted {new Date(bidRequest.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Deadline</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(bidRequest.biddingDeadline).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-semibold">{bidRequest.quantity.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Budget Range</p>
                  <p className="font-semibold">₹{bidRequest.budget.minPrice.toLocaleString()} - ₹{bidRequest.budget.maxPrice.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Delivery Date</p>
                  <p className="font-semibold">{new Date(bidRequest.timeline.requestedDeliveryDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{bidRequest.specifications.deliveryLocation.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Specifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{bidRequest.specifications.description}</p>
                </div>
                
                {bidRequest.specifications.customRequirements && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Custom Requirements</h3>
                    <p className="text-gray-600">{bidRequest.specifications.customRequirements}</p>
                  </div>
                )}
                
                {bidRequest.specifications.qualityStandards && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Quality Standards</h3>
                    <p className="text-gray-600">{bidRequest.specifications.qualityStandards}</p>
                  </div>
                )}
                
                {bidRequest.specifications.packagingRequirements && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Packaging Requirements</h3>
                    <p className="text-gray-600">{bidRequest.specifications.packagingRequirements}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bid Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bid Requirements</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {bidRequest.bidRequirements.minimumFactoryRating && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < bidRequest.bidRequirements.minimumFactoryRating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {bidRequest.bidRequirements.minimumFactoryRating}+ stars
                      </span>
                    </div>
                  </div>
                )}
                
                {bidRequest.bidRequirements.preferredMaxDistance && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Maximum Distance</h3>
                    <p className="text-gray-600">{bidRequest.bidRequirements.preferredMaxDistance} km</p>
                  </div>
                )}
                
                {bidRequest.bidRequirements.paymentTerms && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Terms</h3>
                    <p className="text-gray-600">{bidRequest.bidRequirements.paymentTerms}</p>
                  </div>
                )}
                
                {bidRequest.bidRequirements.requiresCertifications && bidRequest.bidRequirements.requiresCertifications.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Required Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {bidRequest.bidRequirements.requiresCertifications.map((cert) => (
                        <span key={cert} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {bidRequest.notes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
                <p className="text-gray-600">{bidRequest.notes}</p>
              </div>
            )}

            {/* Received Bids (for warehouses) */}
            {user?.role === 'warehouse' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Received Bids ({bids.length})
                </h2>
                
                {bids.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No bids received yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <div key={bid._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{bid.factoryId.name}</h3>
                            <p className="text-sm text-gray-600">
                              {bid.factoryId.location.city}, {bid.factoryId.location.state}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded-full ${getBidStatusColor(bid.status)}`}>
                              {bid.status.toUpperCase()}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(bid.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Total Price</p>
                            <p className="font-semibold text-lg">₹{bid.pricing.totalPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Delivery</p>
                            <p className="font-semibold">{new Date(bid.delivery.estimatedDeliveryDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Production Time</p>
                            <p className="font-semibold">{bid.delivery.productionTimeInDays} days</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Value Proposition</p>
                          <p className="text-sm text-gray-600">{bid.proposal.valueProposition}</p>
                        </div>
                        
                        {bid.qualityAssurance.certifications.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Certifications</p>
                            <div className="flex flex-wrap gap-1">
                              {bid.qualityAssurance.certifications.map((cert) => (
                                <span key={cert} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {bid.status === 'submitted' && bidRequest.status === 'open' && (
                          <button
                            onClick={() => acceptBid(bid._id)}
                            disabled={acceptingBid === bid._id}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {acceptingBid === bid._id ? 'Accepting...' : 'Accept Bid'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Warehouse Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="font-semibold">{bidRequest.warehouseId.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-gray-900">{bidRequest.warehouseId.location.address}</p>
                  <p className="text-gray-600">{bidRequest.warehouseId.location.city}, {bidRequest.warehouseId.location.state}</p>
                </div>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Location</h2>
              <div className="space-y-2">
                <p className="text-gray-900">{bidRequest.specifications.deliveryLocation.address}</p>
                <p className="text-gray-600">
                  {bidRequest.specifications.deliveryLocation.city}, {bidRequest.specifications.deliveryLocation.state}
                </p>
              </div>
            </div>

            {/* Action Button for Factories */}
            {user?.role === 'factory' && bidRequest.status === 'open' && new Date() < new Date(bidRequest.biddingDeadline) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <button
                  onClick={() => navigate(`/bidding/requests/${requestId}/submit-bid`)}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Submit Your Bid
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidRequestDetailsPage;