import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import BookGrid from './components/BookGrid';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import booksData from './data/books.json';
import { Book } from './types';
import AdminDashboard from './components/AdminDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [currentView, setCurrentView] = useState<'books' | 'cart' | 'checkout' | 'orders'>('books');
  const [searchTerm, setSearchTerm] = useState('');
  const [books] = useState<Book[]>(booksData);

  const handleCartClick = () => {
    setCurrentView(currentView === 'cart' ? 'books' : 'cart');
  };

  const handleBackToBooks = () => {
    setCurrentView('books');
  };

  const handleProceedToCheckout = () => {
    setCurrentView('checkout');
  };

  const handleBackToCart = () => {
    setCurrentView('cart');
  };

  const handleOrdersClick = () => {
    setCurrentView('orders');
  };

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/*" element={
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen bg-gray-50">
                <Header
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onCartClick={handleCartClick}
                  onOrdersClick={handleOrdersClick}
                  currentView={currentView}
                />
                <main className="pb-8">
                  {currentView === 'books' && (
                    <BookGrid books={books} searchTerm={searchTerm} />
                  )}
                  {currentView === 'cart' && (
                    <Cart
                      onBackToBooks={handleBackToBooks}
                      onProceedToCheckout={handleProceedToCheckout}
                    />
                  )}
                  {currentView === 'checkout' && (
                    <Checkout onBackToCart={handleBackToCart} />
                  )}
                  {currentView === 'orders' && (
                    <OrderHistory onBack={handleBackToBooks} />
                  )}
                </main>
                {/* Footer */}
                <footer className="bg-gray-800 text-white py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-lg font-semibold mb-2">Goonj Library</h3>
                    <p className="text-gray-400">Spreading knowledge, one book at a time</p>
                    <p className="text-sm text-gray-500 mt-4">
                      © 2024 Goonj Library. All rights reserved.
                    </p>
                  </div>
                </footer>
              </div>
            </CartProvider>
          </AuthProvider>
        } />
      </Routes>
    </Router>
  );
}

export default App;