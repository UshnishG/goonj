export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  image: string;
  description: string;
  isbn: string;
  pages: number;
  language: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Address {
  fullName: string;
  phone: string;
  houseNumber: string;
  streetName: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentMethod {
  type: 'upi' | 'card' | 'cod' | 'razorpay';
  details?: {
    upiId?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  address: Address;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}