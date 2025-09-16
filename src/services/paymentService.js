// Midtrans Configuration
const midtransConfig = {
  serverKey: import.meta.env.VITE_MIDTRANS_SERVER_KEY,
  clientKey: import.meta.env.VITE_MIDTRANS_CLIENT_KEY,
  isProduction: import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true',
  snapUrl: import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true' 
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'
};

// Add state management for Snap
let snapState = 'idle'; // idle, loading, popup

// Midtrans Payment Functions
export const initializeMidtransPayment = async (transactionData) => {
  try {
    const response = await fetch('/api/midtrans/create-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...transactionData,
        server_key: midtransConfig.serverKey
      })
    });

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error initializing Midtrans payment:', error);
    throw error;
  }
};

export const loadMidtransSnap = () => {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve(window.snap);
      return;
    }

    const script = document.createElement('script');
    script.src = midtransConfig.snapUrl;
    script.setAttribute('data-client-key', midtransConfig.clientKey);
    script.onload = () => resolve(window.snap);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const processPayment = async (snapToken, callbacks = {}) => {
  try {
    // Check if popup is already open
    if (snapState === 'popup') {
      throw new Error('Payment popup is already open. Please close it first.');
    }

    snapState = 'loading';
    const snap = await loadMidtransSnap();
    
    snapState = 'popup';
    snap.pay(snapToken, {
      onSuccess: (result) => {
        snapState = 'idle';
        console.log('Payment success:', result);
        if (callbacks.onSuccess) callbacks.onSuccess(result);
      },
      onPending: (result) => {
        snapState = 'idle';
        console.log('Payment pending:', result);
        if (callbacks.onPending) callbacks.onPending(result);
      },
      onError: (result) => {
        snapState = 'idle';
        console.error('Payment error:', result);
        if (callbacks.onError) callbacks.onError(result);
      },
      onClose: () => {
        snapState = 'idle';
        console.log('Payment popup closed');
        if (callbacks.onClose) callbacks.onClose();
      }
    });
  } catch (error) {
    snapState = 'idle';
    console.error('Error processing payment:', error);
    throw error;
  }
};

// Mock function for creating transaction (replace with actual backend call)
export const createTransaction = async (orderData) => {
  try {
    // This should be replaced with actual backend API call
    const transactionData = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: orderData.amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone
      },
      item_details: orderData.items || [{
        id: 'item-1',
        price: orderData.amount,
        quantity: 1,
        name: orderData.itemName || 'Product'
      }]
    };

    // For now, return mock token - replace with actual API call
    const mockToken = `snap-token-${Date.now()}`;
    return mockToken;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Fix mock payment flow - don't use real Snap with mock token
export const handlePaymentFlow = async (orderData, callbacks = {}) => {
  try {
    console.warn('handlePaymentFlow uses mock token. Use handleSafePaymentFlow for real payments.');
    
    // For mock flow, just simulate success
    setTimeout(() => {
      if (callbacks.onSuccess) {
        callbacks.onSuccess({ 
          status_code: '200',
          status_message: 'Mock payment successful',
          transaction_id: `ORDER-${Date.now()}`
        });
      }
    }, 1000);
    
    return `mock-token-${Date.now()}`;
  } catch (error) {
    console.error('Error in payment flow:', error);
    if (callbacks.onError) callbacks.onError(error);
    throw error;
  }
};

// Direct Snap implementation (frontend only)
export const createDirectPayment = async (orderData) => {
  try {
    // Load Snap first
    await loadMidtransSnap();
    
    // Use Snap's embed mode or redirect
    const parameter = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: orderData.amount
      },
      customer_details: {
        first_name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone
      },
      item_details: [{
        id: 'item-1',
        price: orderData.amount,
        quantity: 1,
        name: orderData.itemName || 'Product'
      }]
    };

    // For frontend-only, use Snap redirect
    window.snap.pay(parameter.transaction_details.order_id, {
      // This requires server-side token generation
      // Alternative: use embed mode with limited features
    });

  } catch (error) {
    console.error('Error creating direct payment:', error);
    throw error;
  }
};

// Alternative: Use Midtrans redirect URL
export const redirectToMidtrans = (orderData) => {
  const params = new URLSearchParams({
    order_id: `ORDER-${Date.now()}`,
    gross_amount: orderData.amount,
    first_name: orderData.customerName,
    email: orderData.customerEmail,
    phone: orderData.customerPhone
  });
  
  // Redirect ke halaman Midtrans (memerlukan setup khusus)
  window.location.href = `https://app.sandbox.midtrans.com/payment-links/your-link?${params}`;
};

// Validation function
const validateMidtransConfig = () => {
  if (!midtransConfig.clientKey) {
    throw new Error('Midtrans Client Key tidak ditemukan. Pastikan VITE_MIDTRANS_CLIENT_KEY sudah diset di .env');
  }
  if (!midtransConfig.serverKey) {
    console.warn('Server Key tidak ditemukan. Beberapa fitur mungkin tidak berfungsi.');
  }
};

// Generate actual Snap token with CORS handling
export const generateSnapToken = async (orderData) => {
  try {
    validateMidtransConfig();
    
    const parameter = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: orderData.amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone
      },
      item_details: [{
        id: 'item-1',
        price: orderData.amount,
        quantity: 1,
        name: orderData.itemName || 'Product'
      }]
    };

    const snapUrl = midtransConfig.isProduction 
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    // Use a proxy or CORS-enabled endpoint
    const response = await fetch(snapUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(midtransConfig.serverKey + ':')}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(parameter)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error_messages) {
      throw new Error(data.error_messages.join(', '));
    }
    
    return data.token;
  } catch (error) {
    console.error('Error generating snap token:', error);
    
    // Fallback to payment link if token generation fails
    console.log('Falling back to payment link method...');
    throw new Error('Token generation failed. Please use payment link method.');
  }
};

// Missing function that's referenced in handleSafePaymentFlow
export const handleRealPaymentFlow = async (orderData, callbacks = {}) => {
  try {
    // Generate real snap token
    const snapToken = await generateSnapToken(orderData);
    
    // Process payment with real snap token
    await processPayment(snapToken, callbacks);
    
    return snapToken;
  } catch (error) {
    console.error('Error in real payment flow:', error);
    if (callbacks.onError) callbacks.onError(error);
    throw error;
  }
};

// Improved payment link with dynamic parameters
export const createPaymentLink = (orderData) => {
  // Use your actual Payment Link ID
  const paymentLinkId = import.meta.env.VITE_MIDTRANS_PAYMENT_LINK_ID || '1757960845938';
  
  const baseUrl = midtransConfig.isProduction 
    ? 'https://app.midtrans.com'
    : 'https://app.sandbox.midtrans.com';
  
  // Generate a unique identifier for this payment attempt
  const uniqueId = `${auth.currentUser?.uid || 'guest'}-${Date.now()}`;
  
  // Add unique identifier and order data as query parameters
  const params = new URLSearchParams({
    unique_id: uniqueId,
    order_ref: `ORDER-${Date.now()}`,
    customer: orderData.customerName || '',
    email: orderData.customerEmail || '',
    amount: orderData.amount || 0,
    item: orderData.itemName || 'Premium Plan'
  });
  
  // Create payment link with query parameters to make it unique per transaction
  return `${baseUrl}/payment-links/${paymentLinkId}?${params.toString()}`;
};

// Import Firebase functions
import { updateUserStatus, storePaymentTransaction, getUserStatus } from '../lib/firebase.js';
import { auth } from '../lib/firebase.js';

// Utility function to remove undefined values from objects
const cleanObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value) && value.constructor === Object) {
        // Recursively clean nested objects
        const cleanedNested = cleanObject(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    } else {
      console.warn(`Removing ${key} with value:`, value);
    }
  }
  return cleaned;
};

// Alternative: Store in localStorage temporarily
const storePaymentTransactionLocal = (transactionData) => {
  try {
    const transactionId = `TXN-${Date.now()}`;
    const transaction = {
      id: transactionId,
      ...transactionData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Store in localStorage
    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    existingTransactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(existingTransactions));
    
    console.log('Transaction stored locally:', transaction);
    return transactionId;
  } catch (error) {
    console.error('Error storing transaction locally:', error);
    throw error;
  }
};

// Function to handle payment success callback
export const handlePaymentSuccess = async (transactionId, paymentResult) => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    // Calculate premium expiry date (30 days from now)
    const premiumExpiryDate = new Date();
    premiumExpiryDate.setDate(premiumExpiryDate.getDate() + 30);

    // Update user to premium status - clean undefined values
    const successUpdate = cleanObject({
      isPremium: true,
      plan: 'premium',
      paymentStatus: 'completed',
      lastPayment: new Date().toISOString(),
      premiumExpiry: premiumExpiryDate.toISOString(),
      transactionId: transactionId,
      // Clear pending fields
      pendingAmount: null,
      pendingPlan: null,
      pendingTransactionId: null
    });

    await updateUserStatus(auth.currentUser.uid, successUpdate);

    // Update transaction status in Firebase
    if (transactionId) {
      await updatePaymentStatus(transactionId, 'settlement', {
        paymentResult: paymentResult,
        completedAt: new Date().toISOString(),
        amount: 24900
      });
    }

    console.log('User upgraded to premium successfully');
    return true;
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
};

// Add function to check transaction status from Midtrans
export const checkMidtransTransactionStatus = async (orderId) => {
  try {
    const statusUrl = midtransConfig.isProduction 
      ? `https://api.midtrans.com/v2/${orderId}/status`
      : `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(midtransConfig.serverKey + ':')}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
};

// Updated safe payment flow with new amount
export const handleSafePaymentFlow = async (orderData, callbacks = {}) => {
  try {
    // Check if user is authenticated
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to make payment');
    }

    // Payment Link approach (recommended since you have it setup)
    const paymentUrl = createPaymentLink(orderData);
    
    // Store transaction in Firebase with updated amount
    const transactionData = cleanObject({
      orderId: `ORDER-${Date.now()}`,
      customerDetails: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone
      },
      amount: 24900, // Updated price
      itemName: orderData.itemName || 'AI Career Premium Plan - Monthly',
      paymentMethod: 'payment_link',
      paymentUrl: paymentUrl,
      paymentLinkId: import.meta.env.VITE_MIDTRANS_PAYMENT_LINK_ID || '1757960845938',
      userId: auth.currentUser.uid
    });

    const transactionId = await storePaymentTransaction(transactionData);
    
    // Update user status to indicate pending payment - clean undefined values
    const userStatusUpdate = cleanObject({
      paymentStatus: 'pending',
      pendingTransactionId: transactionId,
      pendingAmount: 24900, // Updated price
      pendingPlan: orderData.itemName && orderData.itemName.includes('Premium') ? 'premium' : 'basic'
    });
    
    console.log('About to update user status with:', userStatusUpdate);
    
    await updateUserStatus(auth.currentUser.uid, userStatusUpdate);
    
        // Show success message before redirect
        if (callbacks.onSuccess) {
          callbacks.onSuccess({
            transactionId: transactionId,
            paymentUrl: paymentUrl,
            message: 'Payment link created successfully'
          });
        }
        
        // Open payment URL
        window.open(paymentUrl, '_blank');
        
        return transactionId;
      } catch (error) {
        console.error('Error in safe payment flow:', error);
        if (callbacks.onError) callbacks.onError(error);
        throw error;
      }
    };
    
    // Check if user's premium subscription has expired
    export const checkPremiumExpiry = async () => {
      try {
        if (!auth.currentUser) {
          return false;
        }
        
        // This should be called periodically or on app load
        // In a real app, this would be handled by a backend service
        const userStatus = await getUserStatus(auth.currentUser.uid);
    
    if (userStatus?.isPremium && userStatus?.premiumExpiry) {
      const expiryDate = new Date(userStatus.premiumExpiry);
      const now = new Date();
      
      if (now > expiryDate) {
        // Premium has expired - clean undefined values
        const expiryUpdate = cleanObject({
          isPremium: false,
          plan: 'free',
          paymentStatus: 'expired',
          expiredAt: now.toISOString()
        });
        
        await updateUserStatus(auth.currentUser.uid, expiryUpdate);
        
        return false; // Premium expired
      }
    }
    
    return userStatus?.isPremium || false;
  } catch (error) {
    console.error('Error checking premium expiry:', error);
    return false;
  }
};

// Remove Firebase dependency for now
// import { storePaymentTransaction } from '../lib/firebase.js';

// Add function to retrieve transactions from localStorage
export const getStoredTransactions = () => {
  try {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    return [];
  }
};

// Reset Snap state if needed
export const resetSnapState = () => {
  snapState = 'idle';
};
