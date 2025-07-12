import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Truck, Search, Zap, Shield, Factory } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect Warehouses with Factories
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Smart bidding system that connects warehouses with factories through competitive bidding. 
              Get the best deals through transparent auction-style procurement.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
                <Link 
                  to="/bidding" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  View Bidding
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/dashboard" 
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  to="/bidding" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  {user.role === 'warehouse' ? 'Create Bid Request' : 'View Bid Opportunities'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SmartSupply?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform revolutionizes the way warehouses and factories connect and do business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Find the best deals with our intelligent algorithm that considers both price and distance.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Bidding</h3>
              <p className="text-gray-600">
                Get instant responses from factories with our real-time bidding and negotiation system.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Built with enterprise-grade security to protect your business transactions and data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Warehouses */}
            <div>
              <div className="flex items-center mb-6">
                <Truck className="h-8 w-8 text-primary-600 mr-3" />
                <h3 className="text-2xl font-bold">For Warehouses</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold">Create Bid Request</h4>
                    <p className="text-gray-600">Submit detailed requirements for the products you need from factories.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold">Receive Competitive Bids</h4>
                    <p className="text-gray-600">Get multiple offers from qualified factories with pricing and delivery details.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold">Accept Best Bid</h4>
                    <p className="text-gray-600">Review proposals and accept the bid that best meets your requirements.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Factories */}
            <div>
              <div className="flex items-center mb-6">
                <Factory className="h-8 w-8 text-primary-600 mr-3" />
                <h3 className="text-2xl font-bold">For Factories</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold">View Bid Requests</h4>
                    <p className="text-gray-600">Browse active bid requests from warehouses looking for products.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold">Submit Competitive Bids</h4>
                    <p className="text-gray-600">Provide detailed proposals with pricing, delivery, and quality assurance.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold">Win & Deliver</h4>
                    <p className="text-gray-600">Get selected for orders and maintain ongoing business relationships.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of warehouses and factories already using SmartSupply to streamline their operations.
          </p>
          {!user && (
            <Link 
              to="/register" 
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Start Free Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
