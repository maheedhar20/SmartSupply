import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { LogOut, User, ShoppingBag, BarChart3, Truck, Gavel } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-primary-600 font-bold text-xl">
              <div className="h-8 w-8 relative">
                {/* Advanced Smart Supply Chain Logo */}
                <svg
                  viewBox="0 0 32 32"
                  className="h-8 w-8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer network ring */}
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="url(#gradient1)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    className="animate-spin"
                    style={{ animationDuration: '20s' }}
                  />
                  
                  {/* Connected nodes */}
                  <circle cx="16" cy="4" r="2.5" fill="#2563eb" />
                  <circle cx="28" cy="16" r="2.5" fill="#3b82f6" />
                  <circle cx="16" cy="28" r="2.5" fill="#2563eb" />
                  <circle cx="4" cy="16" r="2.5" fill="#3b82f6" />
                  
                  {/* Central hub with intelligence symbol */}
                  <circle cx="16" cy="16" r="5" fill="url(#gradient2)" />
                  
                  {/* Smart brain/AI symbol in center */}
                  <path
                    d="M12 16c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"
                    fill="white"
                  />
                  <path
                    d="M14 15l2 1.5 2-1.5v2l-2 1.5-2-1.5v-2z"
                    fill="#2563eb"
                  />
                  
                  {/* Connection lines */}
                  <line x1="16" y1="9" x2="16" y2="11" stroke="#60a5fa" strokeWidth="2" />
                  <line x1="23" y1="16" x2="21" y2="16" stroke="#60a5fa" strokeWidth="2" />
                  <line x1="16" y1="23" x2="16" y2="21" stroke="#60a5fa" strokeWidth="2" />
                  <line x1="9" y1="16" x2="11" y2="16" stroke="#60a5fa" strokeWidth="2" />
                  
                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span>SmartSupply</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/bidding" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Gavel className="h-4 w-4" />
              <span>Bidding</span>
            </Link>

            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  to="/orders" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Orders</span>
                </Link>

                <Link 
                  to="/tracking" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Truck className="h-4 w-4" />
                  <span>Tracking</span>
                </Link>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
