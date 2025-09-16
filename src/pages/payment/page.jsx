import React, { useState } from 'react';
import { handleSafePaymentFlow, resetSnapState, handlePaymentSuccess } from '../../services/paymentService';

const PaymentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    amount: 24900,
    itemName: 'AI Career Premium Plan - Monthly'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus('');

    try {
      // Reset any previous Snap state
      resetSnapState();
      
      // Use safe payment flow with Payment Link
      await handleSafePaymentFlow(formData, {
        onRedirect: (result) => {
          setPaymentStatus(`Payment link created! Transaction ID: ${result.transactionId}`);
          console.log('Payment redirect:', result);
          
          // Start listening for payment completion
          checkPaymentCompletion(result.transactionId);
        },
        onError: (error) => {
          setPaymentStatus('Payment failed!');
          console.error('Payment error:', error);
        }
      });
    } catch (error) {
      setPaymentStatus('Error creating payment link');
      console.error('Payment initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentCompletion = (transactionId) => {
    // Poll for payment completion every 10 seconds
    const interval = setInterval(async () => {
      try {
        // This would typically check with your backend or Midtrans API
        // For now, we'll simulate completion after 30 seconds for demo
        const isComplete = await checkTransactionStatus(transactionId);
        
        if (isComplete) {
          clearInterval(interval);
          await handlePaymentSuccess(transactionId, { status: 'settlement' });
          setPaymentStatus('Payment completed successfully! You are now premium.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 10000);

    // Clear interval after 5 minutes to prevent infinite polling
    setTimeout(() => clearInterval(interval), 300000);
  };

  const checkTransactionStatus = async (transactionId) => {
    // This is a placeholder - in production, you'd call your backend
    // or use Midtrans API to check transaction status
    return new Promise((resolve) => {
      // Simulate payment completion for demo
      setTimeout(() => resolve(true), 30000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Payment Information
        </h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item
            </label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount (IDR)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </form>

        <button
          onClick={handlePayment}
          disabled={isLoading || !formData.customerName || !formData.customerEmail}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {isLoading ? 'Creating Payment Link...' : 'Pay with Midtrans'}
        </button>

        {paymentStatus && (
          <div className={`mt-4 p-3 rounded-md text-center ${
            paymentStatus.includes('successful') 
              ? 'bg-green-100 text-green-800' 
              : paymentStatus.includes('failed') 
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {paymentStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
