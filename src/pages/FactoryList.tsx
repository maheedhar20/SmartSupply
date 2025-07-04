import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Package, Star } from 'lucide-react';
import { api } from '../utils/api.ts';
import type { Factory } from '../types/index.ts';

const FactoryList: React.FC = () => {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchFactories();
    fetchCategories();
  }, []);

  const fetchFactories = async () => {
    try {
      const response = await api.get('/factories');
      setFactories(response.data);
    } catch (error) {
      console.error('Error fetching factories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/meta/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await api.get(`/factories?${params}`);
      setFactories(response.data);
    } catch (error) {
      console.error('Error searching factories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFactories = factories.filter(factory => {
    if (!selectedCategory) return true;
    return factory.products?.some(product => product.category === selectedCategory);
  });

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
            Browse Factories
          </h1>
          <p className="text-lg text-gray-600">
            Discover verified factories and their products
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search factories by name or location..."
                  className="input-field pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field min-w-[150px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="btn-primary px-6"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Factory Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFactories.map((factory) => (
            <div key={factory._id} className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {factory.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{factory.location.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-500 mb-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm ml-1">4.8</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Package className="h-4 w-4 mr-1" />
                    <span className="text-sm">{factory.productCount || 0} products</span>
                  </div>
                </div>
              </div>

              {/* Product Categories */}
              {factory.products && factory.products.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(factory.products.map(p => p.category))]
                      .slice(0, 3)
                      .map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    {[...new Set(factory.products.map(p => p.category))].length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{[...new Set(factory.products.map(p => p.category))].length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Sample Products */}
              {factory.products && factory.products.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Products:</h4>
                  <div className="space-y-2">
                    {factory.products.slice(0, 2).map((product) => (
                      <div key={product._id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{product.name}</span>
                        <span className="font-medium">${product.pricePerUnit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Link
                  to={`/factories/${factory._id}`}
                  className="btn-primary flex-1 text-center"
                >
                  View Details
                </Link>
                <button className="btn-secondary">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFactories.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No factories found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactoryList;
