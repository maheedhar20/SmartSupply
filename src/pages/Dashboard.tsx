import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { api } from '../utils/api.ts';
import { Package, ShoppingBag, TrendingUp, Clock, Building2, Warehouse, Gavel, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalBidRequests?: number;
  activeBidRequests?: number;
  totalBids?: number;
  acceptedBids?: number;
  pendingBids?: number;
  totalValue: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBidRequests: 0,
    activeBidRequests: 0,
    totalBids: 0,
    acceptedBids: 0,
    pendingBids: 0,
    totalValue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'warehouse') {
        // Fetch warehouse-specific data
        const bidRequestsResponse = await api.get('bidding/my-requests');
        const bidRequests = bidRequestsResponse.data;
        
        // For now, set basic stats
        setStats({
          totalBidRequests: bidRequests.length,
          activeBidRequests: bidRequests.filter((req: any) => req.status === 'active').length,
          totalValue: 0, // Will be calculated from accepted bids
        });
        
        setRecentActivity(bidRequests.slice(0, 5));
      } else {
        // Fetch factory-specific data
        const bidsResponse = await api.get('bidding/my-bids');
        const bids = bidsResponse.data;
        
        setStats({
          totalBids: bids.length,
          acceptedBids: bids.filter((bid: any) => bid.status === 'accepted').length,
          pendingBids: bids.filter((bid: any) => bid.status === 'pending').length,
          totalValue: bids
            .filter((bid: any) => bid.status === 'accepted')
            .reduce((sum: number, bid: any) => sum + (bid.pricing?.total || 0), 0),
        });
        
        setRecentActivity(bids.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default stats on error
      setStats({
        totalBidRequests: 0,
        activeBidRequests: 0,
        totalBids: 0,
        acceptedBids: 0,
        pendingBids: 0,
        totalValue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {user?.role === 'warehouse' ? (
                <Warehouse className="h-5 w-5 text-primary-600" />
              ) : (
                <Building2 className="h-5 w-5 text-primary-600" />
              )}
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
                {user?.role === 'warehouse' ? 'Warehouse' : 'Factory'}
              </span>
            </div>
            <Link
              to="/bidding"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {user?.role === 'warehouse' ? 'View Bidding' : 'Browse Opportunities'}
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {user?.role === 'warehouse' ? (
                <>
                  <Link
                    to="/bidding/create"
                    className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Gavel className="h-5 w-5 text-primary-600 mr-3" />
                    <span className="text-primary-600 font-medium">Create New Bid Request</span>
                  </Link>
                  <Link
                    to="/bidding"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ShoppingBag className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-600 font-medium">View My Bid Requests</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/bidding"
                    className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Package className="h-5 w-5 text-primary-600 mr-3" />
                    <span className="text-primary-600 font-medium">Browse Bid Opportunities</span>
                  </Link>
                  <Link
                    to="/bidding"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <TrendingUp className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-600 font-medium">View My Bids</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {user?.role === 'warehouse' ? (
                <>
                  <p>• Be specific in your bid requests for better proposals</p>
                  <p>• Compare multiple bids before making a decision</p>
                  <p>• Include quality requirements in your specifications</p>
                </>
              ) : (
                <>
                  <p>• Submit competitive bids with detailed proposals</p>
                  <p>• Respond quickly to bid requests</p>
                  <p>• Highlight your quality certifications and capabilities</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.role === 'warehouse' ? (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bid Requests</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalBidRequests}</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Gavel className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Requests</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.activeBidRequests}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Received Bids</p>
                    <p className="text-3xl font-bold text-green-600">0</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-3xl font-bold text-primary-600">
                      ${stats.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bids</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalBids}</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Gavel className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Bids</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingBids}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Accepted Bids</p>
                    <p className="text-3xl font-bold text-green-600">{stats.acceptedBids}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-3xl font-bold text-primary-600">
                      ${stats.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.role === 'warehouse' ? 'Recent Bid Requests' : 'Recent Bids'}
            </h2>
          </div>
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {user?.role === 'warehouse' ? 'No bid requests yet' : 'No bids yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {user?.role === 'warehouse' 
                    ? 'Create your first bid request to start receiving proposals from factories.'
                    : 'Start browsing bid opportunities to submit your first proposal.'
                  }
                </p>
                <Link
                  to={user?.role === 'warehouse' ? '/bidding/create' : '/bidding'}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {user?.role === 'warehouse' ? 'Create Bid Request' : 'Browse Opportunities'}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item: any) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {user?.role === 'warehouse' ? item.title : item.bidRequest?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {user?.role === 'warehouse' 
                            ? `${item.productSpecs?.category} • ${item.quantity} units`
                            : `Bid Amount: $${item.pricing?.total?.toLocaleString() || 'N/A'}`
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
