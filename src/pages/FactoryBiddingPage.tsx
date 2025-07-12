import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, DollarSign, Calendar, Truck, Award, FileText, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { api } from '../utils/api.ts';

interface BidRequest {
  _id: string;
  warehouseId: {
    name: string;
    location: {
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
}

interface BidFormData {
  pricing: {
    unitPrice: number;
    totalPrice: number;
    priceBreakdown: {
      materialCost: number;
      laborCost: number;
      overheadCost: number;
      margin: number;
    };
    discountOffered: number;
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
    warrantyCoverage: string;
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
    alternativeSpecs: string;
    valueProposition: string;
    riskMitigation: string;
  };
  competitiveAdvantages: string[];
  validUntil: string;
}

const FactoryBiddingPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bidRequest, setBidRequest] = useState<BidRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<BidFormData>({
    pricing: {
      unitPrice: 0,
      totalPrice: 0,
      priceBreakdown: {
        materialCost: 0,
        laborCost: 0,
        overheadCost: 0,
        margin: 0
      },
      discountOffered: 0,
      paymentTerms: '30 days'
    },
    delivery: {
      estimatedDeliveryDate: '',
      deliveryMethod: 'Road Transport',
      shippingCost: 0,
      productionTimeInDays: 7
    },
    qualityAssurance: {
      certifications: [],
      qualityGuarantee: '',
      warrantyCoverage: '',
      sampleAvailable: false
    },
    factoryCapacity: {
      currentCapacity: 80,
      maxCapacity: 100,
      experienceYears: 5,
      similarProjectsCompleted: 0
    },
    proposal: {
      message: '',
      alternativeSpecs: '',
      valueProposition: '',
      riskMitigation: ''
    },
    competitiveAdvantages: [],
    validUntil: ''
  });

  const availableCertifications = [
    'ISO 9001',
    'ISO 14001',
    'HACCP',
    'GMP',
    'FDA Approved',
    'CE Marking',
    'BRC',
    'Organic Certified'
  ];

  const paymentTermsOptions = [
    '15 days',
    '30 days',
    '45 days',
    '60 days',
    '90 days',
    'On delivery',
    'Advance payment',
    'Letter of Credit'
  ];

  const deliveryMethods = [
    'Road Transport',
    'Rail Transport',
    'Air Cargo',
    'Sea Freight',
    'Express Delivery',
    'Own Fleet'
  ];

  useEffect(() => {
    fetchBidRequestDetails();
    setDefaultDates();
  }, [requestId]);

  useEffect(() => {
    if (bidRequest) {
      calculateTotalPrice();
    }
  }, [formData.pricing.unitPrice, bidRequest?.quantity]);

  const setDefaultDates = () => {
    const now = new Date();
    const defaultValidUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const defaultDeliveryDate = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
    
    setFormData(prev => ({
      ...prev,
      validUntil: defaultValidUntil.toISOString().split('T')[0],
      delivery: {
        ...prev.delivery,
        estimatedDeliveryDate: defaultDeliveryDate.toISOString().split('T')[0]
      }
    }));
  };

  const calculateTotalPrice = () => {
    if (bidRequest && formData.pricing.unitPrice > 0) {
      const total = formData.pricing.unitPrice * bidRequest.quantity;
      const discountAmount = (formData.pricing.discountOffered / 100) * total;
      const finalTotal = total - discountAmount;
      
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          totalPrice: finalTotal
        }
      }));
    }
  };

  const fetchBidRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`bidding/requests/${requestId}`);
      setBidRequest(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bid request details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleCertificationToggle = (cert: string) => {
    const current = formData.qualityAssurance.certifications;
    const updated = current.includes(cert)
      ? current.filter(c => c !== cert)
      : [...current, cert];
    
    handleInputChange('qualityAssurance.certifications', updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Validation
      if (!formData.pricing.unitPrice || formData.pricing.unitPrice <= 0) {
        throw new Error('Please enter a valid unit price');
      }

      if (!formData.proposal.message.trim()) {
        throw new Error('Please provide a proposal message');
      }

      if (!formData.proposal.valueProposition.trim()) {
        throw new Error('Please provide a value proposition');
      }

      if (!formData.qualityAssurance.qualityGuarantee.trim()) {
        throw new Error('Please provide quality guarantee details');
      }

      // Submit bid
      await api.post(`bidding/requests/${requestId}/bid`, formData);
      
      navigate('/bidding');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit bid');
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== 'factory') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only factories can submit bids.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bid request...</p>
        </div>
      </div>
    );
  }

  if (error || !bidRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/bidding/requests/${requestId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Request Details
          </button>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit Bid</h1>
            <p className="text-gray-600 mb-4">
              Submit your competitive proposal for: <span className="font-semibold">{bidRequest.productName}</span>
            </p>
            
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold ml-1">{bidRequest.quantity.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Budget Range:</span>
                <span className="font-semibold ml-1">₹{bidRequest.budget.minPrice.toLocaleString()} - ₹{bidRequest.budget.maxPrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Deadline:</span>
                <span className="font-semibold ml-1">{new Date(bidRequest.biddingDeadline).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Delivery:</span>
                <span className="font-semibold ml-1">{new Date(bidRequest.timeline.requestedDeliveryDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Pricing Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Pricing Details</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricing.unitPrice}
                  onChange={(e) => handleInputChange('pricing.unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.pricing.totalPrice}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Offered (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.pricing.discountOffered}
                  onChange={(e) => handleInputChange('pricing.discountOffered', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <select
                  value={formData.pricing.paymentTerms}
                  onChange={(e) => handleInputChange('pricing.paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {paymentTermsOptions.map(term => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Delivery Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Delivery Details</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery Date *
                </label>
                <input
                  type="date"
                  value={formData.delivery.estimatedDeliveryDate}
                  onChange={(e) => handleInputChange('delivery.estimatedDeliveryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Production Time (days) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.delivery.productionTimeInDays}
                  onChange={(e) => handleInputChange('delivery.productionTimeInDays', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Method
                </label>
                <select
                  value={formData.delivery.deliveryMethod}
                  onChange={(e) => handleInputChange('delivery.deliveryMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {deliveryMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.delivery.shippingCost}
                  onChange={(e) => handleInputChange('delivery.shippingCost', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Quality Assurance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Quality Assurance</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Certifications
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableCertifications.map(cert => (
                    <label key={cert} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.qualityAssurance.certifications.includes(cert)}
                        onChange={() => handleCertificationToggle(cert)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Guarantee *
                </label>
                <textarea
                  rows={3}
                  value={formData.qualityAssurance.qualityGuarantee}
                  onChange={(e) => handleInputChange('qualityAssurance.qualityGuarantee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your quality guarantee and standards..."
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty Coverage
                  </label>
                  <input
                    type="text"
                    value={formData.qualityAssurance.warrantyCoverage}
                    onChange={(e) => handleInputChange('qualityAssurance.warrantyCoverage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 12 months replacement warranty"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.qualityAssurance.sampleAvailable}
                      onChange={(e) => handleInputChange('qualityAssurance.sampleAvailable', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Sample available for testing</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Proposal Details</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposal Message *
                </label>
                <textarea
                  rows={4}
                  value={formData.proposal.message}
                  onChange={(e) => handleInputChange('proposal.message', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Introduce your company and explain why you're the best choice for this project..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value Proposition *
                </label>
                <textarea
                  rows={3}
                  value={formData.proposal.valueProposition}
                  onChange={(e) => handleInputChange('proposal.valueProposition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What unique value do you bring to this project?"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternative Specifications
                  </label>
                  <textarea
                    rows={3}
                    value={formData.proposal.alternativeSpecs}
                    onChange={(e) => handleInputChange('proposal.alternativeSpecs', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any alternative specifications you can offer..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Mitigation
                  </label>
                  <textarea
                    rows={3}
                    value={formData.proposal.riskMitigation}
                    onChange={(e) => handleInputChange('proposal.riskMitigation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How do you plan to mitigate project risks?"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bid Validity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Bid Validity</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid Until
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => handleInputChange('validUntil', e.target.value)}
                className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {submitting ? 'Submitting Bid...' : 'Submit Bid'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(`/bidding/requests/${requestId}`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FactoryBiddingPage;