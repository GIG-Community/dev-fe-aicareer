import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, getUserStatus, updateUserStatus } from '../../lib/firebase';
import { handleSafePaymentFlowWithDiscount, validateDiscountCode, getPriceByDiscountCode } from '../../services/paymentService';
import { Crown, Star, CheckCircle, Sparkles, RocketIcon, Globe2, Target, BookOpenCheck, BrainCircuit, Users, Lock, ExternalLink, MessageCircle, Phone, Instagram } from 'lucide-react';
import Sidebar from '../../components/sidebar';
import BottomNavigation from '../../components/bottom-navigation';

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
    <div className="glass-card p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className={`p-2 sm:p-3 bg-gradient-to-br ${color} rounded-xl`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-blue-600 font-medium text-sm sm:text-base">{subtitle}</p>
        </div>
      </div>
      <p className="text-slate-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">{description}</p>
      {!userStatus?.isPremium && (
        <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <span className="font-semibold text-amber-800 text-sm sm:text-base">Fitur Premium</span>
          </div>
          <p className="text-amber-700 text-sm">Upgrade ke premium untuk mengakses fitur ini.</p>
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
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-20 lg:pb-0">
            {/* Welcome Card - Mobile optimized */}
            <div className="glass-card p-4 sm:p-6 lg:p-8 text-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-hologram">
                Selamat Datang di AI Career
              </h2>
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                {userStatus?.isPremium ? (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-100 border border-amber-200 rounded-full">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    <span className="font-semibold text-amber-800 text-xs sm:text-sm">Premium User</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 border border-blue-200 rounded-full">
                    <span className="font-semibold text-blue-800 text-xs sm:text-sm">Free User</span>
                  </div>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Platform AI-powered untuk mengembangkan kemampuan dan mempercepat pertumbuhan karir digital Anda.
              </p>
            </div>

            {/* Stats Cards - Mobile responsive grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { number: userStatus?.isPremium ? "Unlimited" : "5", label: "Tests Available", icon: BookOpenCheck },
                { number: userStatus?.isPremium ? "Unlimited" : "3", label: "Interviews/Month", icon: Globe2 },
                { number: userStatus?.isPremium ? "Advanced" : "Basic", label: "AI Analysis", icon: BrainCircuit },
                { number: userStatus?.isPremium ? "24/7" : "Limited", label: "Support", icon: Users }
              ].map((stat, index) => (
                <div key={index} className="glass-card-secondary p-3 sm:p-4 lg:p-6 text-center">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600 mx-auto mb-2 sm:mb-3" />
                  <div className="text-sm sm:text-base lg:text-lg font-bold mb-1 text-slate-800">{stat.number}</div>
                  <div className="text-slate-500 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Links Section */}
            <div className="glass-card p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-slate-800">Quick Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Feedback Form */}
                <a
                  href="https://forms.gle/7dHpUrawwwB5pvbe8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card-secondary p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm sm:text-base mb-1 sm:mb-2">Feedback Form</h4>
                  <p className="text-slate-600 text-xs sm:text-sm">Berikan masukan untuk perbaikan layanan kami</p>
                </a>

                {/* WhatsApp Community */}
                <a
                  href="https://www.instagram.com/aicareer_id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card-secondary p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                      <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm sm:text-base mb-1 sm:mb-2">Instagram</h4>
                  <p className="text-slate-600 text-xs sm:text-sm">Follow Instagram Kami @aicareer_id</p>
                </a>

                {/* Contact Person */}
                <a
                  href="https://wa.me/+6285727627146"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card-secondary p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm sm:text-base mb-1 sm:mb-2">Contact Person</h4>
                  <p className="text-slate-600 text-xs sm:text-sm">Hubungi tim support untuk bantuan</p>
                </a>
              </div>
            </div>

            {/* Premium Upgrade Card - Mobile optimized */}
            {!userStatus?.isPremium && (
              <div className="glass-card-primary p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 text-slate-800">Buka Semua Fitur AI Career</h3>
                  <p className="text-slate-600 text-sm sm:text-base">
                    Dapatkan akses penuh ke semua layanan AI untuk mengakselerasi pertumbuhan karir digital Anda.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
                  {[
                    { icon: RocketIcon, title: "AI Improve" },
                    { icon: Globe2, title: "AI Interview" },
                    { icon: Target, title: "AI Project" },
                    { icon: BookOpenCheck, title: "AI Test" },
                    { icon: BrainCircuit, title: "AI Work" },
                    { icon: Users, title: "Priority Support" }
                  ].map((feature, index) => (
                    <div key={index} className="bg-white/80 border border-blue-200/50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600 mx-auto mb-1 sm:mb-2" />
                      <h4 className="font-semibold text-slate-800 text-xs sm:text-sm lg:text-base">{feature.title}</h4>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-3 sm:mb-4">
                    Rp 24,900 <span className="text-sm sm:text-base lg:text-lg font-normal text-slate-500">/bulan</span>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl sm:rounded-2xl font-medium hover:shadow-lg transition-all text-sm sm:text-base"
                  >
                    Upgrade Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg sm:text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="hero-grid"></div>
      </div>

      {/* Notifications - Mobile positioned */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-2 sm:right-4 z-50 space-y-2 max-w-xs sm:max-w-md">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`glass-card px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm ${
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
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50 text-sm">
          Tidak ada koneksi internet
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeRoute={activeRoute}
        userStatus={userStatus}
        user={user}
        onNavigation={handleNavigation}
        onLogout={handleLogout}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        activeRoute={activeRoute}
        userStatus={userStatus}
        user={user}
        onNavigation={handleNavigation}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="glass-card p-3 sm:p-4 lg:p-6 border-b flex items-center justify-between">
          <p className="text-xl font-bold text-slate-800">Dashboard</p>
          {userStatus?.isPremium && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-amber-600">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">Premium</span>
            </div>
          )}
        </header>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Upgrade Modal - Mobile optimized */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full mx-4 p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Upgrade ke Premium</h3>
              <p className="text-slate-600 text-sm sm:text-base">Buka semua fitur AI Career</p>
            </div>
            
            {/* Discount Form - Mobile optimized */}
            {showDiscountForm && (
              <div className="mb-4 sm:mb-6">
                <input
                  type="text"
                  placeholder="Masukkan kode diskon"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-xl mb-3 text-sm sm:text-base"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyDiscount}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm sm:text-base"
                  >
                    Terapkan
                  </button>
                  <button
                    onClick={() => setShowDiscountForm(false)}
                    className="flex-1 bg-gray-100 py-2 rounded-lg text-sm sm:text-base"
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
            
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-3 sm:mb-4">
                Rp {appliedDiscount ? appliedDiscount.price.toLocaleString() : '24.900'}
                <span className="text-sm sm:text-base lg:text-lg font-normal text-slate-500">/bulan</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-3 border rounded-xl text-sm sm:text-base"
              >
                Nanti Saja
              </button>
              <button
                onClick={handleUpgradeToPremium}
                disabled={paymentLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-4 py-3 rounded-xl disabled:opacity-50 text-sm sm:text-base"
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
