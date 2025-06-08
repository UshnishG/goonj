import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, CartItem, Address, PaymentMethod } from '../types';

export const createOrder = async (
  userId: string,
  items: CartItem[],
  total: number,
  address: Address,
  paymentMethod: PaymentMethod
): Promise<string> => {
  try {
    const orderData: Omit<Order, 'id'> = {
      userId,
      items,
      total,
      address,
      paymentMethod,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status'], trackingNumber?: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updateData: Record<string, any> = {
      status,
      updatedAt: new Date(),
    };
    
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }
    
    await updateDoc(orderRef, updateData);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const updateOrderPayment = async (
  orderId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      razorpayOrderId,
      razorpayPaymentId,
      status: 'confirmed',
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating order payment:', error);
    throw error;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Order);
    });
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};