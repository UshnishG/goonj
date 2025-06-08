import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';
import { Order } from '../types';

interface OrderHistoryProps {
  onBack: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </button>
        <h1 className="text-3xl font-bold text-gray-900 ml-8">My Orders</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-24 w-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-gray-600">
                      Placed on {order.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    {getStatusIcon(order.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                    <div className="text-gray-600 text-sm">
                      <p>{order.address.fullName}</p>
                      <p>{order.address.address}</p>
                      <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                      <p>{order.address.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                    <p className="text-gray-600 text-sm capitalize">
                      {order.paymentMethod.type === 'cod' ? 'Cash on Delivery' : order.paymentMethod.type}
                    </p>
                    {order.trackingNumber && (
                      <div className="mt-2">
                        <h4 className="font-medium text-gray-900">Tracking Number</h4>
                        <p className="text-blue-600 font-mono text-sm">{order.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.book.id} className="flex items-center space-x-4">
                      <img
                        src={item.book.image}
                        alt={item.book.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.book.title}</h5>
                        <p className="text-gray-600 text-sm">by {item.book.author}</p>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(item.book.price * 0.5 * item.quantity).toFixed(2)}</p>
                        <p className="text-gray-400 line-through text-sm">₹{(item.book.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-xl font-bold text-green-600">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;