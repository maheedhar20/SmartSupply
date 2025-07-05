import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { api } from '../utils/api.ts';
import type { Order } from '../types/index.ts';
import { Package, Clock, CheckCircle, XCircle, Truck, Calendar, User, Navigation, Phone, AlertCircle } from 'lucide-react';

const Tracking: React.FC = () => {
  const { user } = useAuth();
  console.log('Current user:', user); // Suppress unused warning
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchOrderId, setSearchOrderId] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'in_production': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'in_production': return <Package className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', description: 'Your order has been submitted' },
      { key: 'accepted', label: 'Order Accepted', description: 'Factory has accepted your order' },
      { key: 'in_production', label: 'In Production', description: 'Your order is being manufactured' },
      { key: 'completed', label: 'Completed', description: 'Order completed and ready for delivery' }
    ];

    const statusOrder = ['pending', 'accepted', 'in_production', 'completed'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const getLogisticsInfo = (order: Order) => {
    // Mock logistics data based on order status
    const baseLocations = [
      { name: 'Factory Warehouse', address: 'Loading Bay', coordinates: { lat: 19.0896, lng: 72.8656 } },
      { name: 'Distribution Center', address: 'Mumbai Central Hub', coordinates: { lat: 19.0830, lng: 72.8258 } },
      { name: 'Last Mile Facility', address: 'Andheri Depot', coordinates: { lat: 19.0728, lng: 72.8826 } },
      { name: 'Delivery Address', address: 'Customer Location', coordinates: { lat: 19.0760, lng: 72.8777 } }
    ];

    let currentLocation = baseLocations[0];
    let vehicleInfo = {
      driver: 'Raj Kumar',
      phone: '+91-98765-43210',
      vehicle: 'MH-01-AB-1234',
      type: 'Truck'
    };

    switch (order.status) {
      case 'accepted':
        currentLocation = baseLocations[0];
        break;
      case 'in_production':
        currentLocation = baseLocations[1];
        break;
      case 'completed':
        currentLocation = baseLocations[3];
        break;
      default:
        currentLocation = baseLocations[0];
    }

    return {
      currentLocation,
      vehicleInfo,
      route: baseLocations,
      estimatedArrival: order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate) : null,
      actualArrival: order.actualDeliveryDate ? new Date(order.actualDeliveryDate) : null
    };
  };

  const filteredOrders = searchOrderId 
    ? orders.filter(order => order._id.includes(searchOrderId))
    : orders;

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Tracking
          </h1>
          <p className="text-lg text-gray-600">
            Track your orders and monitor delivery status
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="Search by Order ID..."
                className="input-field"
              />
            </div>
            <button
              onClick={() => setSearchOrderId('')}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <div 
                    key={order._id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedOrder?._id === order._id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-gray-900">
                            Order #{order._id.slice(-8)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {typeof order.productId === 'object' ? order.productId.name : 'Product'}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            Qty: {order.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ₹{order.totalPrice.toLocaleString()}
                        </div>
                        {order.estimatedDeliveryDate && (
                          <div className="text-sm text-gray-500">
                            Est. {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Order Details
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Order Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">#{selectedOrder._id.slice(-8)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{selectedOrder.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium">₹{selectedOrder.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Tracker */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Order Progress</h4>
                      <div className="space-y-4">
                        {getStatusSteps(selectedOrder.status).map((step) => (
                          <div key={step.key} className="flex items-start gap-3">
                            <div className={`rounded-full p-2 ${
                              step.completed 
                                ? 'bg-primary-600 text-white' 
                                : step.active 
                                  ? 'bg-primary-100 text-primary-600' 
                                  : 'bg-gray-100 text-gray-400'
                            }`}>
                              {step.completed ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className={`font-medium ${
                                step.completed ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {step.label}
                              </div>
                              <div className="text-sm text-gray-500">
                                {step.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Information */}
                    {selectedOrder.estimatedDeliveryDate && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Delivery Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Truck className="h-4 w-4" />
                            <span>Estimated Delivery:</span>
                          </div>
                          <div className="font-medium">
                            {new Date(selectedOrder.estimatedDeliveryDate).toLocaleDateString()}
                          </div>
                          {selectedOrder.actualDeliveryDate && (
                            <>
                              <div className="flex items-center gap-2 text-gray-600 mt-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>Delivered On:</span>
                              </div>
                              <div className="font-medium text-green-600">
                                {new Date(selectedOrder.actualDeliveryDate).toLocaleDateString()}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>Factory:</span>
                        </div>
                        <div className="font-medium">
                          {typeof selectedOrder.factoryId === 'object' ? selectedOrder.factoryId.name : 'Factory Name'}
                        </div>
                      </div>
                    </div>

                    {/* Logistics Tracking */}
                    {(selectedOrder.status === 'accepted' || selectedOrder.status === 'in_production' || selectedOrder.status === 'completed') && (() => {
                      const logistics = getLogisticsInfo(selectedOrder);
                      return (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">🚛 Live Tracking</h4>
                          
                          {/* Current Vehicle Location */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Navigation className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-900">Current Location</span>
                            </div>
                            <div className="text-sm text-blue-800">
                              <div className="font-medium">{logistics.currentLocation.name}</div>
                              <div>{logistics.currentLocation.address}</div>
                            </div>
                          </div>

                          {/* Vehicle & Driver Info */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Truck className="h-4 w-4 text-gray-600" />
                              <span className="font-medium text-gray-900">Vehicle Details</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Driver:</span>
                                <div className="font-medium">{logistics.vehicleInfo.driver}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Vehicle:</span>
                                <div className="font-medium">{logistics.vehicleInfo.vehicle}</div>
                              </div>
                              <div className="col-span-2">
                                <div className="flex items-center gap-2 mt-2">
                                  <Phone className="h-3 w-3 text-gray-500" />
                                  <span className="text-blue-600 font-medium">{logistics.vehicleInfo.phone}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Timeline */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-green-900">Estimated Delivery</span>
                            </div>
                            {logistics.estimatedArrival && (
                              <div className="text-sm">
                                <div className="font-medium text-green-800">
                                  {logistics.estimatedArrival.toLocaleDateString()} at {logistics.estimatedArrival.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                                {selectedOrder.status !== 'completed' && (
                                  <div className="text-green-600 mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>On time delivery expected</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Route Progress */}
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-2">Delivery Route</h5>
                            <div className="space-y-2">
                              {logistics.route.map((location, index) => {
                                const isCurrentLocation = location.name === logistics.currentLocation.name;
                                const isPassed = logistics.route.indexOf(logistics.currentLocation) > index;
                                
                                return (
                                  <div key={index} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                      isCurrentLocation 
                                        ? 'bg-blue-500 ring-4 ring-blue-200' 
                                        : isPassed 
                                          ? 'bg-green-500' 
                                          : 'bg-gray-300'
                                    }`} />
                                    <div className="flex-1">
                                      <div className={`text-sm ${
                                        isCurrentLocation ? 'font-medium text-blue-900' : 'text-gray-700'
                                      }`}>
                                        {location.name}
                                      </div>
                                      <div className="text-xs text-gray-500">{location.address}</div>
                                    </div>
                                    {isCurrentLocation && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Select an order to view tracking details</p>
              </div>
            )}
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {searchOrderId ? 'Try a different search term' : 'You haven\'t placed any orders yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
