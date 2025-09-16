import React, { useState } from 'react';
import { handleSafePaymentFlowWithDiscount, resetSnapState, handlePaymentSuccess, validateDiscountCode, getPriceByDiscountCode } from '../../services/paymentService';

const PaymentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
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

  const handleApplyDiscount = () => {
    if (validateDiscountCode(discountCode)) {
      const priceInfo = getPriceByDiscountCode(discountCode);
      setAppliedDiscount(priceInfo);
      setFormData(prev => ({ ...prev, amount: priceInfo.price }));
      setPaymentStatus(`Kode diskon berhasil diterapkan! Hemat Rp ${priceInfo.discount.toLocaleString()}`);
    } else {
      setPaymentStatus('Kode diskon tidak valid');
      setAppliedDiscount(null);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
    setFormData(prev => ({ ...prev, amount: 24900 }));
    setPaymentStatus('');
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus('');

    try {
      // Reset any previous Snap state
      resetSnapState();
      
      // Use safe payment flow with discount support
      await handleSafePaymentFlowWithDiscount(
        formData,
        appliedDiscount ? discountCode : null,
        {
          onSuccess: (result) => {
            setPaymentStatus(result.message || 'Payment link created successfully!');
            console.log('Payment redirect:', result);
            
            // Start listening for payment completion
            checkPaymentCompletion(result.transactionId);
          },
          onError: (error) => {
            setPaymentStatus('Payment failed!');
            console.error('Payment error:', error);
          }
        }
      );
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
        
        {/* Discount Form */}
        <div className="mb-6">
          {!showDiscountForm && !appliedDiscount && (
            <button 
              onClick={() => setShowDiscountForm(true)}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              Punya kode diskon?
            </button>
          )}
          
          {showDiscountForm && !appliedDiscount && (
            <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700">
                Kode Diskon
              </label>
              <input
                type="text"
                placeholder="Masukkan kode diskon"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleApplyDiscount}
                  disabled={!discountCode}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  Terapkan
                </button>
                <button
                  onClick={() => setShowDiscountForm(false)}
                  className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
          
          {appliedDiscount && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 font-medium text-sm">Kode diskon aktif!</p>
                  <p className="text-green-600 text-xs">Hemat Rp {appliedDiscount.discount.toLocaleString()}</p>
                </div>
                <button
                  onClick={handleRemoveDiscount}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          )}
        </div>
        
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
            <div className="mt-1 relative">
              {appliedDiscount && (
                <div className="text-sm text-gray-400 line-through mb-1">
                  Rp {appliedDiscount.originalPrice.toLocaleString()}
                </div>
              )}
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                readOnly
              />
              {appliedDiscount && (
                <div className="text-sm text-green-600 mt-1">
                  Diskon: Rp {appliedDiscount.discount.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </form>

        <button
          onClick={handlePayment}
          disabled={isLoading || !formData.customerName || !formData.customerEmail}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {isLoading ? 'Creating Payment Link...' : `Pay Rp ${formData.amount.toLocaleString()}`}
        </button>

        {paymentStatus && (
          <div className={`mt-4 p-3 rounded-md text-center ${
            paymentStatus.includes('successful') || paymentStatus.includes('berhasil')
              ? 'bg-green-100 text-green-800' 
              : paymentStatus.includes('failed') || paymentStatus.includes('tidak valid')
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
