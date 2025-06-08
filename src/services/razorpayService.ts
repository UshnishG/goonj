declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: Record<string, any>) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number): Promise<{ id: string; amount: number }> => {
  // In a real application, this would be a call to your backend
  // For demo purposes, we'll simulate the order creation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `order_${Date.now()}`,
        amount: amount * 100, // Razorpay expects amount in paise
      });
    }, 1000);
  });
};

export const initiateRazorpayPayment = async (
  amount: number,
  userEmail: string,
  userName: string,
  userPhone: string,
  onSuccess: (response: Record<string, any>) => void,
  onError: (error: Record<string, any>) => void
) => {
  try {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    const order = await createRazorpayOrder(amount);

    const options: Record<string, any> = {
      key: 'rzp_test_1234567890', // Replace with your Razorpay key
      amount: order.amount,
      currency: 'INR',
      name: 'Goonj Library',
      description: 'Book Purchase',
      order_id: order.id,
      handler: onSuccess,
      prefill: {
        name: userName,
        email: userEmail,
        contact: userPhone,
      },
      theme: {
        color: '#1e40af',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', onError as Record<string, any>);
    razorpay.open();
  } catch (error) {
    onError(error as Record<string, any>);
  }
};