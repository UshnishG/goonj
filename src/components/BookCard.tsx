import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { Book } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { dispatch } = useCart();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const discountedPrice = book.price * 0.5;

  const handleAddToCart = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: book });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-amber-800 text-white px-2 py-1 rounded-full text-xs font-semibold">
          50% OFF
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="mb-2">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
            {book.category}
          </span>
        </div>
        
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2">by {book.author}</p>
        
        <p className="text-gray-700 text-xs sm:text-sm mb-3 line-clamp-2">
          {book.description}
        </p>
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{book.pages} pages</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-gray-400 line-through text-xs sm:text-sm">₹{book.price}</span>
            <span className="text-lg sm:text-xl font-bold text-green-600">₹{discountedPrice}</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="bg-amber-800 hover:bg-amber-900 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default BookCard;