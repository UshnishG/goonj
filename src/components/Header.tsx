import React, { useState } from 'react';
import { ShoppingCart, Search, BookOpen, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';
import AuthModal from './AuthModal';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCartClick: () => void;
  onOrdersClick: () => void;
  currentView: 'books' | 'cart' | 'checkout' | 'orders';
}

const Header: React.FC<HeaderProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onCartClick,
  onOrdersClick,
  currentView 
}) => {
  const { state } = useCart();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  // You can replace this with your actual logo URL
  const logoUrl = '/logo.png'; 

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-16 py-2 sm:py-0 gap-2 sm:gap-0">
            {/* Logo */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start">
              <div className="flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="Goonj Library" className="h-10 w-10 sm:h-12 sm:w-12 brightness-0" />
                ) : (
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-900" />
                )}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Goonj Library</h1>
                <p className="text-xs sm:text-xs text-gray-500">Knowledge for Everyone</p>
              </div>
            </div>

            {/* Search Bar */}
            {currentView === 'books' && (
              <div className="w-full sm:flex-1 max-w-full sm:max-w-md mx-0 sm:mx-8 mt-2 sm:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search books, authors, categories..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}

            {/* Right side actions */}
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
              {/* Cart Button */}
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-600 hover:text-amber-800 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Profile or Sign In */}
              {user ? (
                <UserProfile onOrdersClick={onOrdersClick} />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-amber-800 transition-colors text-sm"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="hidden md:block">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Header;