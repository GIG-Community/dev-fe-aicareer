import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, getUserStatus, updateUserStatus } from '../../lib/firebase';
import { handleSafePaymentFlowWithDiscount, validateDiscountCode, getPriceByDiscountCode } from '../../services/paymentService';
import { Crown, Star, CheckCircle, Sparkles, RocketIcon, Globe2, Target, BookOpenCheck, BrainCircuit, Users, Lock } from 'lucide-react';
import Sidebar from '../../components/sidebar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [expiredTransaction, setExpiredTransaction] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: RocketIcon, path: '/dashboard', isPremium: false },
    { id: 'aimprove', label: 'AI Improve', icon: RocketIcon, path: '/aimprove', isPremium: true },
    { id: 'ainterview', label: 'AI Interview', icon: Globe2, path: '/ainterview', isPremium: true },
    { id: 'aiproject', label: 'AI Project', icon: Target, path: '/aiproject', isPremium: true },
    { id: 'aitest', label: 'AI Test', icon: BookOpenCheck, path: '/aitest', isPremium: true },
    { id: 'aiwork', label: 'AI Work', icon: BrainCircuit, path: '/aiwork', isPremium: true }
  ];

  const availableFeatures = menuItems.filter(item => !item.isPremium || userStatus?.isPremium);

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
        navigate('/');
      }
      setLoading(false);
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  const addNotification = useCallback((type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const handleNavigation = useCallback((item) => {
    if (item.isPremium && !userStatus?.isPremium) {
      setShowUpgradeModal(true);
      addNotification('info', `${item.label} adalah fitur premium`);
      return;
    }
    setActiveRoute(item.id);
    if (item.path !== '/dashboard') {
      navigate(item.path);
    }
  }, [userStatus?.isPremium, navigate, addNotification]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUpgradeToPremium = async () => {
    setPaymentLoading(true);
    setPaymentError(null);
    
    try {
      const finalAmount = appliedDiscount ? appliedDiscount.price : 24900;
      const orderData = {
        customerName: user.displayName || user.email.split('@')[0],
        customerEmail: user.email,
        customerPhone: userStatus?.phone || '',
        amount: finalAmount,
        itemName: 'AI Career Premium Plan - Monthly'
      };

      await handleSafePaymentFlowWithDiscount(
        orderData,
        appliedDiscount ? discountCode : null,
        {
          onSuccess: async (result) => {
            await updateUserStatus(user.uid, {
              paymentStatus: 'pending',
              pendingTransactionId: result.transactionId,
              pendingAmount: finalAmount,
              discountCode: appliedDiscount ? discountCode : null,
              isDiscountPayment: appliedDiscount ? true : false
            });
            setShowUpgradeModal(false);
            addNotification('success', 'Payment berhasil dibuat!');
          },
          onError: (error) => {
            setPaymentError('Terjadi kesalahan saat memproses pembayaran.');
            addNotification('error', 'Gagal memproses pembayaran');
          }
        }
      );
    } catch (error) {
      setPaymentError('Terjadi kesalahan saat upgrade.');
      addNotification('error', 'Gagal upgrade ke premium');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleApplyDiscount = () => {
    if (validateDiscountCode(discountCode)) {
      const priceInfo = getPriceByDiscountCode(discountCode);
      setAppliedDiscount(priceInfo);
      setPaymentError(null);
      addNotification('success', `Diskon ${discountCode} berhasil diterapkan!`);
    } else {
      setPaymentError('Kode diskon tidak valid');
      setAppliedDiscount(null);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
    setPaymentError(null);
  };

  const handleRetryPayment = async () => {
    if (!expiredTransaction) return;
    
    setPaymentLoading(true);
    setPaymentError(null);
    
    try {
      // Add retry logic here
      setExpiredTransaction(null);
      setShowUpgradeModal(false);
      addNotification('success', 'Payment retry berhasil dibuat!');
    } catch (error) {
      console.error('Retry error:', error);
      setPaymentError('Gagal retry payment. Silakan buat transaksi baru.');
      addNotification('error', 'Gagal retry payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const renderFeatureCard = (route, Icon, title, subtitle, description, color) => (
    <div className="glass-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 bg-gradient-to-br ${color} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-blue-600 font-medium">{subtitle}</p>
        </div>
      </div>
      <p className="text-slate-600 leading-relaxed mb-6">{description}</p>
      {!userStatus?.isPremium && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Fitur Premium</span>
          </div>
          <p className="text-amber-700">Upgrade ke premium untuk mengakses fitur ini.</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeRoute) {
      case 'aimprove':
        return renderFeatureCard('aimprove', RocketIcon, 'AI Improve', 'Jalur Karir Personal', 
          'Jalur karir yang dipersonalisasi untuk mengembangkan kemampuan teknis dan soft skill serta meningkatkan portofolio',
          'from-blue-500 to-purple-600');
      case 'ainterview':
        return renderFeatureCard('ainterview', Globe2, 'AI Interview', 'Simulasi Interview Cerdas',
          'Simulasi tes teknis dan soft skill lengkap dengan rekomendasi peningkatan kemampuan',
          'from-indigo-500 to-blue-600');
      case 'aiwork':
        return renderFeatureCard('aiwork', BrainCircuit, 'AI Work', 'Simulasi Kerja Real',
          'Simulasi pengalaman kerja dengan kasus nyata untuk mengasah kemampuan dalam lingkungan yang aman',
          'from-teal-500 to-cyan-600');
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Card */}
            <div className="glass-card p-8 text-center">
              <h2 className="text-4xl font-bold mb-4 text-hologram">
                Selamat Datang di AI Career
              </h2>
              <div className="flex items-center justify-center gap-3 mb-4">
                {userStatus?.isPremium ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-200 rounded-full">
                    <Crown className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">Premium User</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full">
                    <span className="font-semibold text-blue-800">Free User</span>
                  </div>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed">
                Platform AI-powered untuk mengembangkan kemampuan dan mempercepat pertumbuhan karir digital Anda.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { number: userStatus?.isPremium ? "Unlimited" : "5", label: "Tests Available", icon: BookOpenCheck },
                { number: userStatus?.isPremium ? "Unlimited" : "3", label: "Interviews/Month", icon: Globe2 },
                { number: userStatus?.isPremium ? "Advanced" : "Basic", label: "AI Analysis", icon: BrainCircuit },
                { number: userStatus?.isPremium ? "24/7" : "Limited", label: "Support", icon: Users }
              ].map((stat, index) => (
                <div key={index} className="glass-card-secondary p-6 text-center">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-xl font-bold mb-1 text-slate-800">{stat.number}</div>
                  <div className="text-slate-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Premium Upgrade Card */}
            {!userStatus?.isPremium && (
              <div className="glass-card-primary p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Buka Semua Fitur AI Career</h3>
                  <p className="text-slate-600">
                    Dapatkan akses penuh ke semua layanan AI untuk mengakselerasi pertumbuhan karir digital Anda.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: RocketIcon, title: "AI Improve" },
                    { icon: Globe2, title: "AI Interview" },
                    { icon: Target, title: "AI Project" },
                    { icon: BookOpenCheck, title: "AI Test" },
                    { icon: BrainCircuit, title: "AI Work" },
                    { icon: Users, title: "Priority Support" }
                  ].map((feature, index) => (
                    <div key={index} className="bg-white/80 border border-blue-200/50 rounded-xl p-4 text-center">
                      <feature.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-slate-800">{feature.title}</h4>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-4">
                    Rp 24,900 <span className="text-lg font-normal text-slate-500">/bulan</span>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all"
                  >
                    Upgrade Sekarang
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { number: userStatus?.isPremium ? "Unlimited" : "5", label: "Tests Available", icon: BookOpenCheck },
                { number: userStatus?.isPremium ? "Unlimited" : "3", label: "Interviews/Month", icon: Globe2 },
                { number: userStatus?.isPremium ? "Advanced" : "Basic", label: "AI Analysis", icon: BrainCircuit },
                { number: userStatus?.isPremium ? "24/7" : "Limited", label: "Support", icon: Users }
              ].map((stat, index) => (
                <div key={index} className="glass-card-secondary p-6 text-center">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-xl font-bold mb-1 text-slate-800">{stat.number}</div>
                  <div className="text-slate-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="hero-grid"></div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`glass-card px-4 py-2 rounded-lg ${
                notification.type === 'error' ? 'border-red-300 text-red-700' :
                notification.type === 'success' ? 'border-green-300 text-green-700' :
                'border-blue-300 text-blue-700'
              }`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
          Tidak ada koneksi internet
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeRoute={activeRoute}
        userStatus={userStatus}
        user={user}
        onNavigation={handleNavigation}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="glass-card p-6 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          {userStatus?.isPremium && (
            <div className="flex items-center gap-2 text-amber-600">
              <Crown className="w-5 h-5" />
              <span className="font-medium">Premium</span>
            </div>
          )}
        </header>
        
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card max-w-md w-full mx-4 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Upgrade ke Premium</h3>
              <p className="text-slate-600">Buka semua fitur AI Career</p>
            </div>
            
            {/* Discount Form */}
            {showDiscountForm && (
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Masukkan kode diskon"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border rounded-xl mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyDiscount}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                  >
                    Terapkan
                  </button>
                  <button
                    onClick={() => setShowDiscountForm(false)}
                    className="flex-1 bg-gray-100 py-2 rounded-lg"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {!showDiscountForm && !appliedDiscount && (
              <button 
                onClick={() => setShowDiscountForm(true)}
                className="text-blue-600 text-sm mb-4 block mx-auto"
              >
                Punya kode diskon?
              </button>
            )}

            {paymentError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{paymentError}</p>
                {expiredTransaction && (
                  <button
                    onClick={handleRetryPayment}
                    disabled={paymentLoading}
                    className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                  >
                    {paymentLoading ? 'Memproses retry...' : 'Retry Payment'}
                  </button>
                )}
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-4">
                Rp {appliedDiscount ? appliedDiscount.price.toLocaleString() : '24.900'}
                <span className="text-lg font-normal text-slate-500">/bulan</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-3 border rounded-xl"
              >
                Nanti Saja
              </button>
              <button
                onClick={handleUpgradeToPremium}
                disabled={paymentLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl disabled:opacity-50"
              >
                {paymentLoading ? 'Memproses...' : 'Upgrade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
