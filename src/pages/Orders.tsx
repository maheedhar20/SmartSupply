import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { api } from '../utils/api.ts';
import type { Order } from '../types/index.ts';
import { ShoppingBag, Clock, CheckCircle, XCircle, Package, MessageSquare } from 'lucide-react';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [counterPrice, setCounterPrice] = useState('');
  const [counterDate, setCounterDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await api.get(`orders${params}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await api.patch(`orders/${orderId}/status`, {
        status,
        message: responseMessage,
        ...(status === 'accepted' && counterPrice && counterDate && {
          counterOffer: {
            price: parseFloat(counterPrice),
            deliveryDate: counterDate,
          }
        }),
      });

      setSelectedOrder(null);
      setResponseMessage('');
      setCounterPrice('');
      setCounterDate('');
      fetchOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error updating order');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.patch(`orders/${orderId}/cancel`);
        fetchOrders();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error cancelling order');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in_production':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
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
      case 'in_production':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
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
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600">
              {user?.role === 'warehouse' ? 'Manage your orders' : 'Respond to order requests'}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {['all', 'pending', 'accepted', 'in_production', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === status
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {status === 'all' ? 'All Orders' : status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const product = order.productId as any;
            const factory = order.factoryId as any;
            const warehouse = order.warehouseId as any;
            
            return (
              <div key={order._id} className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          #{order._id.slice(-6)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Product:</span>
                          <span className="font-medium">{product?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{order.quantity} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unit Price:</span>
                          <span className="font-medium">${order.unitPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold text-primary-600">
                            ${order.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {user?.role === 'warehouse' ? 'Factory' : 'Warehouse'} Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">
                            {user?.role === 'warehouse' ? factory?.name : warehouse?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">
                            {user?.role === 'warehouse' 
                              ? factory?.location?.address 
                              : warehouse?.location?.address}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {order.notes}
                      </p>
                    </div>
                  )}

                  {order.factoryResponse && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Factory Response:</strong> {order.factoryResponse.message}
                      </p>
                      {order.factoryResponse.counterOffer && (
                        <div className="text-sm text-gray-600">
                          <p><strong>Counter Offer:</strong></p>
                          <p>Price: ${order.factoryResponse.counterOffer.price}</p>
                          <p>Delivery: {new Date(order.factoryResponse.counterOffer.deliveryDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {user?.role === 'factory' && order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="btn-primary"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Respond
                        </button>
                      </>
                    )}

                    {user?.role === 'warehouse' && order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="btn-secondary text-red-600 hover:bg-red-50"
                      >
                        Cancel Order
                      </button>
                    )}

                    {user?.role === 'factory' && order.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'in_production')}
                        className="btn-primary"
                      >
                        Start Production
                      </button>
                    )}

                    {user?.role === 'factory' && order.status === 'in_production' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'completed')}
                        className="btn-primary"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {user?.role === 'warehouse' 
                ? 'Start browsing factories to place your first order!' 
                : 'Orders from warehouses will appear here.'}
            </p>
          </div>
        )}

        {/* Response Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Respond to Order</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Message
                  </label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    rows={3}
                    className="input-field"
                    placeholder="Enter your response..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Counter Price (optional)
                    </label>
                    <input
                      type="number"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                      className="input-field"
                      placeholder="New price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Date (optional)
                    </label>
                    <input
                      type="date"
                      value={counterDate}
                      onChange={(e) => setCounterDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder._id, 'accepted')}
                    className="btn-primary flex-1"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder._id, 'rejected')}
                    className="btn-secondary flex-1 text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
