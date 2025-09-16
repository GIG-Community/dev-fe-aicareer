import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserStatus } from '../lib/firebase';
import { Crown, Lock, ArrowRight } from 'lucide-react';
import { validateDiscountCode, getPriceByDiscountCode, handleSafePaymentFlowWithDiscount } from '../services/paymentService';

const ProtectedRoute = ({ children, requiresPremium = false }) => {
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const status = await getUserStatus(currentUser.uid);
          setUserStatus(status);
        } catch (error) {
          console.error('Error fetching user status:', error);
          setUserStatus({ isPremium: false, plan: 'free' });
        }
      } else {
        navigate('/login');
        return;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleApplyDiscount = () => {
    if (validateDiscountCode(discountCode)) {
      const priceInfo = getPriceByDiscountCode(discountCode);
      setAppliedDiscount(priceInfo);
      alert(`Kode diskon berhasil diterapkan! Hemat Rp ${priceInfo.discount.toLocaleString()}`);
    } else {
      alert('Kode diskon tidak valid');
      setAppliedDiscount(null);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
  };

  const handleDirectPayment = async () => {
    if (isProcessingPayment) return;
    
    setIsProcessingPayment(true);
    
    try {
      const orderData = {
        customerName: user?.displayName || 'User',
        customerEmail: user?.email || 'user@email.com',
        customerPhone: '08123456789', // You might want to get this from user profile
        itemName: 'AI Career Premium Plan - Monthly',
        amount: appliedDiscount ? appliedDiscount.price : 24900
      };

      await handleSafePaymentFlowWithDiscount(
        orderData,
        appliedDiscount ? discountCode : null,
        {
          onSuccess: (result) => {
            console.log('Payment initiated:', result);
            alert('Payment link berhasil dibuat! Silakan selesaikan pembayaran.');
          },
          onError: (error) => {
            console.error('Payment error:', error);
            alert('Terjadi kesalahan saat memproses pembayaran');
          }
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (requiresPremium && !userStatus?.isPremium) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Premium Feature
            </h2>
            
            <p className="text-slate-600 mb-6">
              This feature requires a premium subscription. Upgrade now to unlock all AI Career features and accelerate your career growth.
            </p>
            
            {/* Discount Form */}
            <div className="mb-6">
              {!showDiscountForm && !appliedDiscount && (
                <button 
                  onClick={() => setShowDiscountForm(true)}
                  className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors mb-4"
                >
                  Punya kode diskon?
                </button>
              )}
              
              {showDiscountForm && !appliedDiscount && (
                <div className="space-y-3 mb-4">
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

            {/* Price Display */}
            <div className="mb-6">
              {appliedDiscount && (
                <div className="text-center mb-2">
                  <span className="text-lg text-gray-400 line-through">
                    Rp {appliedDiscount.originalPrice.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="text-3xl font-bold text-slate-800">
                Rp {appliedDiscount ? appliedDiscount.price.toLocaleString() : '24.900'}
                <span className="text-sm font-normal text-slate-600">/bulan</span>
              </div>
              {appliedDiscount && (
                <div className="text-green-600 font-medium text-sm mt-1">
                  Hemat Rp {appliedDiscount.discount.toLocaleString()}!
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold">Premium Benefits</span>
              </div>
              
              <ul className="text-left space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  AI-powered career recommendations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Unlimited interview simulations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Advanced project analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Priority support
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDirectPayment}
                disabled={isProcessingPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? 'Memproses...' : 'Upgrade to Premium'}
                {!isProcessingPayment && <ArrowRight className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => navigate('/payment')}
                className="w-full border border-slate-300 text-slate-700 py-3 px-6 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Go to Payment Page
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full border border-slate-300 text-slate-700 py-3 px-6 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mt-4">
              {appliedDiscount 
                ? `Special price: Rp ${appliedDiscount.price.toLocaleString()}/month` 
                : 'Starting from Rp 24,900/month'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;

