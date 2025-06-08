import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Truck, CheckCircle, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Address, PaymentMethod } from '../types';
import { createOrder } from '../services/orderService';
import { initiateRazorpayPayment } from '../services/razorpayService';
import AuthModal from './AuthModal';
import { Country, State, City } from 'country-state-city';

interface CheckoutProps {
  onBackToCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBackToCart }) => {
  const { state, dispatch } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    houseNumber: '',
    streetName: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'cod',
  });
  const [processing, setProcessing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setProcessing(true);

    try {
      if (paymentMethod.type === 'razorpay') {
        await initiateRazorpayPayment(
          state.total,
          user.email,
          user.displayName,
          address.phone,
          async (response) => {
            // Payment successful
            const orderId = await createOrder(user.uid, state.items, state.total, address, paymentMethod);
            dispatch({ type: 'CLEAR_CART' });
            setStep('confirmation');
            setProcessing(false);
          },
          (error) => {
            console.error('Payment failed:', error);
            setProcessing(false);
            alert('Payment failed. Please try again.');
          }
        );
      } else {
        // For COD and other payment methods
        const orderId = await createOrder(user.uid, state.items, state.total, address, paymentMethod);
        dispatch({ type: 'CLEAR_CART' });
        setStep('confirmation');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      setProcessing(false);
      alert('Order creation failed. Please try again.');
    }
  };

  const isAddressValid = () => {
    return Object.values(address).every(value => value.trim() !== '') && address.phone.length === 10;
  };

  const isPaymentValid = () => {
    if (paymentMethod.type === 'cod' || paymentMethod.type === 'razorpay') return true;
    if (paymentMethod.type === 'upi') return paymentMethod.details?.upiId?.trim() !== '';
    if (paymentMethod.type === 'card') {
      return paymentMethod.details?.cardNumber && 
             paymentMethod.details?.expiryDate && 
             paymentMethod.details?.cvv;
    }
    return false;
  };

  if (step === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your books will be delivered to your address within 3-5 business days.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID: #GNJ{Date.now().toString().slice(-6)}</p>
            <p className="text-lg font-semibold">Total: ₹{state.total.toFixed(2)}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={step === 'address' ? onBackToCart : () => setStep('address')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === 'address' ? 'Back to Cart' : 'Back to Address'}
          </button>
          <h1 className="text-3xl font-bold text-gray-900 ml-8">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'address' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({...address, fullName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={address.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setAddress({...address, phone: val});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        House Number / Street Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.houseNumber}
                        onChange={(e) => setAddress({...address, houseNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="House or Street Number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.streetName}
                        onChange={(e) => setAddress({...address, streetName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Street Name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        required
                        value={selectedCountry}
                        onChange={e => {
                          setSelectedCountry(e.target.value);
                          setSelectedState('');
                          setSelectedCity('');
                          setAddress({ ...address, state: '', city: '' });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Country</option>
                        {countries.map(c => (
                          <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        required
                        value={selectedState}
                        onChange={e => {
                          setSelectedState(e.target.value);
                          setSelectedCity('');
                          setAddress({ ...address, state: states.find(s => s.isoCode === e.target.value)?.name || '', city: '' });
                        }}
                        disabled={!selectedCountry}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select State</option>
                        {states.map(s => (
                          <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <select
                        required
                        value={selectedCity}
                        onChange={e => {
                          setSelectedCity(e.target.value);
                          setAddress({ ...address, city: e.target.value });
                        }}
                        disabled={!selectedState}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city.name} value={city.name}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({...address, pincode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!isAddressValid()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="razorpay"
                        name="payment"
                        checked={paymentMethod.type === 'razorpay'}
                        onChange={() => setPaymentMethod({ type: 'razorpay' })}
                        className="mr-3"
                      />
                      <label htmlFor="razorpay" className="flex items-center cursor-pointer">
                        <Zap className="h-5 w-5 mr-2 text-blue-600" />
                        Pay with Razorpay (UPI, Cards, Wallets)
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cod"
                        name="payment"
                        checked={paymentMethod.type === 'cod'}
                        onChange={() => setPaymentMethod({ type: 'cod' })}
                        className="mr-3"
                      />
                      <label htmlFor="cod" className="flex items-center cursor-pointer">
                        <Truck className="h-5 w-5 mr-2 text-green-600" />
                        Cash on Delivery
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="upi"
                        name="payment"
                        checked={paymentMethod.type === 'upi'}
                        onChange={() => setPaymentMethod({ type: 'upi', details: { upiId: '' } })}
                        className="mr-3"
                      />
                      <label htmlFor="upi" className="flex items-center cursor-pointer">
                        <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                        UPI Payment
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="card"
                        name="payment"
                        checked={paymentMethod.type === 'card'}
                        onChange={() => setPaymentMethod({ 
                          type: 'card', 
                          details: { cardNumber: '', expiryDate: '', cvv: '' } 
                        })}
                        className="mr-3"
                      />
                      <label htmlFor="card" className="flex items-center cursor-pointer">
                        <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                        Credit/Debit Card
                      </label>
                    </div>
                  </div>

                  {/* UPI Details */}
                  {paymentMethod.type === 'upi' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="example@upi"
                        value={paymentMethod.details?.upiId || ''}
                        onChange={(e) => setPaymentMethod({
                          ...paymentMethod,
                          details: { ...paymentMethod.details, upiId: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Card Details */}
                  {paymentMethod.type === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="1234 5678 9012 3456"
                          value={paymentMethod.details?.cardNumber || ''}
                          onChange={(e) => setPaymentMethod({
                            ...paymentMethod,
                            details: { ...paymentMethod.details, cardNumber: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={paymentMethod.details?.expiryDate || ''}
                            onChange={(e) => setPaymentMethod({
                              ...paymentMethod,
                              details: { ...paymentMethod.details, expiryDate: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="123"
                            value={paymentMethod.details?.cvv || ''}
                            onChange={(e) => setPaymentMethod({
                              ...paymentMethod,
                              details: { ...paymentMethod.details, cvv: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isPaymentValid() || processing}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {processing ? 'Processing...' : `Place Order - ₹${state.total.toFixed(2)}`}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              {state.items.map((item) => (
                <div key={item.book.id} className="flex justify-between text-sm">
                  <span>{item.book.title} × {item.quantity}</span>
                  <span>₹{(item.book.price * 0.5 * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">₹{state.total.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You saved ₹{(state.items.reduce((total, item) => total + (item.book.price * item.quantity), 0) - state.total).toFixed(2)} with 50% discount!
              </p>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Checkout;