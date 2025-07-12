import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { api } from '../utils/api.ts';
import type { Product } from '../types/index.ts';
import { ArrowLeft, Package, MapPin, Clock, DollarSign, ShoppingCart } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`products/${id}`);
      setProduct(response.data);
      setOrderQuantity(response.data.minimumOrder);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || user.role !== 'warehouse') {
      navigate('/login');
      return;
    }

    setOrderLoading(true);
    try {
      await api.post('orders', {
        productId: id,
        quantity: orderQuantity,
        notes: orderNotes,
      });
      
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error placing order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Product not found</h3>
        </div>
      </div>
    );
  }

  const factory = product.factoryId as any;
  const totalPrice = product.pricePerUnit * orderQuantity;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  {product.category}
                </span>
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Price per unit</p>
                    <p className="text-xl font-bold text-primary-600">
                      ${product.pricePerUnit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="text-lg font-semibold">
                      {product.availableQuantity} units
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Production time</p>
                    <p className="text-lg font-semibold">
                      {product.productionTimeInDays} days
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Minimum order</p>
                    <p className="text-lg font-semibold">
                      {product.minimumOrder} units
                    </p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {product.specifications.weight && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{product.specifications.weight} kg</span>
                      </div>
                    )}
                    {product.specifications.dimensions && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="font-medium">{product.specifications.dimensions}</span>
                      </div>
                    )}
                    {product.specifications.material && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-medium">{product.specifications.material}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Factory Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">Factory Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-medium">{factory.name}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{factory.location.address}</span>
                </div>
                {factory.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone: {factory.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Form */}
            {user && user.role === 'warehouse' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Place Order</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (min: {product.minimumOrder})
                    </label>
                    <input
                      type="number"
                      min={product.minimumOrder}
                      max={product.availableQuantity}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows={3}
                      className="input-field"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total Price:</span>
                      <span className="text-2xl font-bold text-primary-600">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderLoading || orderQuantity < product.minimumOrder}
                    className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {orderLoading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-600 mb-4">Sign in as a warehouse to place orders</p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
