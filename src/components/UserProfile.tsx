import React, { useState } from 'react';
import { Package, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileProps {
  onOrdersClick: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onOrdersClick }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <span className="hidden md:block font-medium">{user.displayName}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-medium text-gray-900">{user.displayName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          
          <button
            onClick={() => {
              onOrdersClick();
              setIsDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Package className="h-4 w-4" />
            <span>My Orders</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;