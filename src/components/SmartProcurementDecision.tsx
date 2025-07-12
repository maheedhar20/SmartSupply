import React, { useState } from 'react';
import { ShoppingCart, Gavel, TrendingUp, Clock, Users, DollarSign } from 'lucide-react';

interface ProcurementOption {
  type: 'direct' | 'bidding';
  title: string;
  description: string;
  icon: React.ReactNode;
  pros: string[];
  cons: string[];
  bestFor: string[];
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface SmartRecommendationProps {
  onSelectMethod: (method: 'direct' | 'bidding') => void;
  orderDetails?: {
    quantity: number;
    category: string;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
    budget: number;
  };
}

export const SmartProcurementDecision: React.FC<SmartRecommendationProps> = ({ 
  onSelectMethod,
  orderDetails 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'direct' | 'bidding' | null>(null);

  const procurementOptions: ProcurementOption[] = [
    {
      type: 'direct',
      title: 'Direct Factory Selection',
      description: 'Browse and order directly from our verified factories with transparent pricing',
      icon: <ShoppingCart className="w-8 h-8" />,
      pros: [
        'Immediate ordering process',
        'Fixed, transparent pricing',
        'Established factory relationships',
        'Quick delivery confirmation',
        'Lower administrative overhead'
      ],
      cons: [
        'Limited price negotiation',
        'May not get the best deals',
        'Fewer customization options'
      ],
      bestFor: [
        'Standard products with known specifications',
        'Urgent orders requiring quick turnaround',
        'Small to medium quantity orders',
        'Regular supplier relationships'
      ],
      timeframe: '1-2 hours',
      riskLevel: 'low'
    },
    {
      type: 'bidding',
      title: 'Competitive Bidding',
      description: 'Create a bid request and let multiple factories compete for your order',
      icon: <Gavel className="w-8 h-8" />,
      pros: [
        'Competitive pricing through auction',
        'Multiple factory options',
        'Custom specifications welcome',
        'Detailed proposals and comparisons',
        'Potential for significant cost savings'
      ],
      cons: [
        'Longer procurement process',
        'Requires detailed specifications',
        'More complex evaluation needed',
        'Risk of delayed responses'
      ],
      bestFor: [
        'Large quantity orders (bulk purchasing)',
        'Custom or specialized products',
        'Cost-sensitive procurement',
        'New market exploration'
      ],
      timeframe: '3-7 days',
      riskLevel: 'medium'
    }
  ];

  const getSmartRecommendation = () => {
    if (!orderDetails) return null;

    const { quantity, urgency, budget } = orderDetails;
    
    // Logic for smart recommendation
    if (urgency === 'urgent' || urgency === 'high') {
      return 'direct';
    }
    
    if (quantity > 1000 || budget > 50000) {
      return 'bidding';
    }
    
    if (quantity < 500 && urgency === 'medium') {
      return 'direct';
    }
    
    return 'bidding'; // Default to bidding for potential savings
  };

  const recommendedMethod = getSmartRecommendation();

  const handleMethodSelect = (method: 'direct' | 'bidding') => {
    setSelectedMethod(method);
    onSelectMethod(method);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Procurement Method
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          SmartSupply offers two powerful ways to procure products. Choose the method that best fits your needs.
        </p>
        
        {recommendedMethod && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
            <div className="flex items-center gap-2 text-blue-800">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Smart Recommendation:</span>
              <span className="capitalize">{recommendedMethod} method</span>
              {recommendedMethod === 'direct' ? (
                <span className="text-sm">(faster turnaround)</span>
              ) : (
                <span className="text-sm">(better pricing potential)</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {procurementOptions.map((option) => (
          <div
            key={option.type}
            className={`border rounded-xl p-6 transition-all duration-300 cursor-pointer ${
              selectedMethod === option.type
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : recommendedMethod === option.type
                ? 'border-green-300 bg-green-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => handleMethodSelect(option.type)}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-full ${
                option.type === 'direct' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
              }`}>
                {option.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                {recommendedMethod === option.type && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-6">{option.description}</p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Timeline: {option.timeframe}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${
                  option.riskLevel === 'low' ? 'bg-green-400' :
                  option.riskLevel === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="text-gray-600 capitalize">{option.riskLevel} Risk</span>
              </div>
            </div>

            {/* Pros */}
            <div className="mb-4">
              <h4 className="font-semibold text-green-700 mb-2">✅ Advantages</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {option.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="mb-4">
              <h4 className="font-semibold text-red-700 mb-2">⚠️ Considerations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {option.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>

            {/* Best For */}
            <div className="mb-6">
              <h4 className="font-semibold text-blue-700 mb-2">🎯 Best For</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {option.bestFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <button
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                selectedMethod === option.type
                  ? 'bg-blue-600 text-white'
                  : option.type === 'direct'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {selectedMethod === option.type ? 'Selected' : `Choose ${option.title}`}
            </button>
          </div>
        ))}
      </div>

      {selectedMethod && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Great choice! You've selected{' '}
              <span className="capitalize">{selectedMethod}</span> method
            </h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            {selectedMethod === 'direct' 
              ? "You'll now browse our factory listings and can place orders directly with transparent pricing."
              : "You'll create a detailed bid request, and factories will compete to provide you with the best offers."
            }
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => onSelectMethod(selectedMethod)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {selectedMethod === 'direct' ? 'Browse Factories' : 'Create Bid Request'}
            </button>
            <button
              onClick={() => setSelectedMethod(null)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Change Method
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
