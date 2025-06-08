import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  onBackToBooks: () => void;
  onProceedToCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onBackToBooks, onProceedToCheckout }) => {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Discover our amazing collection of books</p>
          <button
            onClick={onBackToBooks}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToBooks}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {state.items.map((item) => {
            const discountedPrice = item.book.price * 0.5;
            return (
              <div key={item.book.id} className="p-6 flex items-center space-x-4">
                <img
                  src={item.book.image}
                  alt={item.book.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{item.book.title}</h3>
                  <p className="text-gray-600">by {item.book.author}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-400 line-through text-sm">₹{item.book.price}</span>
                    <span className="text-green-600 font-semibold">₹{discountedPrice}</span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">50% OFF</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-lg">₹{(discountedPrice * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.book.id)}
                    className="text-red-600 hover:text-red-700 transition-colors mt-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total Items:</span>
            <span className="text-lg">{state.items.reduce((total, item) => total + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">₹{state.total.toFixed(2)}</span>
          </div>
          <button
            onClick={onProceedToCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;