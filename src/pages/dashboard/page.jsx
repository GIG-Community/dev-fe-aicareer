import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, getUserStatus, updateUserStatus } from '../../lib/firebase';
import { handleSafePaymentFlow, getStoredTransactions } from '../../services/paymentService';
import { Crown, Lock, Star, CheckCircle, BrainCircuit, Target, BookOpenCheck, Globe2, RocketIcon, Sparkles, TrendingUp, Users, Award } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [expiredTransaction, setExpiredTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Get user status from Firestore
        try {
          const status = await getUserStatus(currentUser.uid);
          setUserStatus(status);
        } catch (error) {
          console.error('Error fetching user status:', error);
          setUserStatus({ isPremium: false, plan: 'free' });
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const premiumFeatures = ['aimprove', 'ainterview', 'aiproject', 'aitest', 'aiwork'];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', isPremium: false, icon: TrendingUp },
    { id: 'aimprove', label: 'AI Improve', path: '/aimprove', isPremium: true, icon: RocketIcon },
    { id: 'ainterview', label: 'AI Interview', path: '/ainterview', isPremium: true, icon: Globe2 },
    { id: 'aiproject', label: 'AI Project', path: '/aiproject', isPremium: true, icon: Target },
    { id: 'aitest', label: 'AI Test', path: '/aitest', isPremium: true, icon: BookOpenCheck },
    { id: 'aiwork', label: 'AI Work', path: '/aiwork', isPremium: true, icon: BrainCircuit },
    { id: 'payment', label: 'Payment', path: '/payment', isPremium: false, icon: Award }
  ];

  const handleNavigation = (item) => {
    if (item.isPremium && !userStatus?.isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    
    setActiveRoute(item.id);
    if (item.path !== '/dashboard') {
      navigate(item.path);
    }
  };

  const handleUpgradeToPremium = async () => {
    setPaymentLoading(true);
    setPaymentError(null);
    
    try {
      const orderData = {
        customerName: user.displayName || user.email.split('@')[0],
        customerEmail: user.email,
        customerPhone: userStatus?.phone || '',
        amount: 24900, // 24.9k IDR
        itemName: 'AI Career Premium Plan - Monthly'
      };

      await handleSafePaymentFlow(orderData, {
        onRedirect: async ({ transactionId, orderId, paymentUrl, expiresIn }) => {
          console.log('Payment initiated:', { transactionId, orderId, paymentUrl });
          // Update user status to pending premium
          await updateUserStatus(user.uid, {
            paymentStatus: 'pending',
            pendingTransactionId: transactionId,
            pendingOrderId: orderId
          });
          setShowUpgradeModal(false);
          
          // Show success message
          alert(`Payment berhasil dibuat! Link akan expired dalam ${Math.round(expiresIn / 60000)} menit.`);
        },
        onExpired: ({ orderId, transactionId, transaction }) => {
          console.log('Payment expired:', { orderId, transactionId });
          setExpiredTransaction(transaction);
          setPaymentError('Transaksi expired. Silakan coba lagi atau gunakan tombol retry.');
        },
        onError: (error) => {
          console.error('Payment error:', error);
          setPaymentError('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
        }
      });
    } catch (error) {
      console.error('Upgrade error:', error);
      setPaymentError('Terjadi kesalahan saat upgrade. Silakan coba lagi.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!expiredTransaction) return;
    
    setPaymentLoading(true);
    setPaymentError(null);
    
    try {
      await retryExpiredTransaction(expiredTransaction, {
        onRedirect: async ({ transactionId, orderId, paymentUrl, isRetry }) => {
          console.log('Payment retry initiated:', { transactionId, orderId, isRetry });
          setExpiredTransaction(null);
          setShowUpgradeModal(false);
          alert('Payment retry berhasil dibuat!');
        },
        onError: (error) => {
          console.error('Retry payment error:', error);
          setPaymentError('Gagal retry payment. Silakan buat transaksi baru.');
        }
      });
    } catch (error) {
      console.error('Retry error:', error);
      setPaymentError('Gagal retry payment. Silakan buat transaksi baru.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeRoute) {
      case 'aimprove':
        return (
          <div className="content-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <RocketIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">AI Improve</h2>
                <p className="text-blue-600 font-medium">Jalur Karir Personal</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Jalur karir yang dipersonalisasi untuk mengembangkan kemampuan teknis dan soft skill serta meningkatkan portofolio
            </p>
            {!userStatus?.isPremium && (
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Fitur Premium</span>
                </div>
                <p className="text-amber-700">Upgrade ke premium untuk mengakses fitur ini.</p>
              </div>
            )}
          </div>
        );
      case 'ainterview':
        return (
          <div className="content-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">AI Interview</h2>
                <p className="text-green-600 font-medium">Latihan Interview</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Simulasi interview dengan AI yang memberikan feedback langsung untuk persiapan karir yang lebih baik
            </p>
            {!userStatus?.isPremium && (
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Fitur Premium</span>
                </div>
                <p className="text-amber-700">Upgrade ke premium untuk mengakses fitur ini.</p>
              </div>
            )}
          </div>
        );
      case 'aiproject':
        return (
          <div className="content-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">AI Project</h2>
                <p className="text-purple-600 font-medium">Pengembangan Portofolio</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Menghubungkan talenta digital dengan proyek nyata dari UMKM dan komunitas untuk membangun portofolio
            </p>
            {!userStatus?.isPremium && (
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Fitur Premium</span>
                </div>
                <p className="text-amber-700">Upgrade ke premium untuk mengakses fitur ini.</p>
              </div>
            )}
          </div>
        );
      case 'aitest':
        return (
          <div className="content-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                <BookOpenCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">AI Test</h2>
                <p className="text-indigo-600 font-medium">Tes Kemampuan Teknis</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Simulasi tes teknis dan soft skill lengkap dengan rekomendasi peningkatan kemampuan
            </p>
            {!userStatus?.isPremium && (
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Fitur Premium</span>
                </div>
                <p className="text-amber-700">Upgrade ke premium untuk mengakses fitur ini.</p>
              </div>
            )}
          </div>
        );
      case 'aiwork':
        return (
          <div className="content-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">AI Work</h2>
                <p className="text-teal-600 font-medium">Simulasi Kerja Real</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Simulasi pengalaman kerja dengan kasus nyata untuk mengasah kemampuan dalam lingkungan yang aman
            </p>
            {!userStatus?.isPremium && (
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Fitur Premium</span>
                </div>
                <p className="text-amber-700">Upgrade ke premium untuk mengakses fitur ini.</p>
              </div>
            )}
          </div>
        );
      case 'payment':
        return (
          <div className="content-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Payment</h2>
                <p className="text-emerald-600 font-medium">Manajemen Pembayaran</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Kelola pembayaran dan informasi tagihan Anda dengan mudah dan aman.
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Card */}
            <div className="content-card">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                    Selamat Datang di AI Career
                  </span>
                </h2>
                <div className="flex items-center justify-center gap-3 mb-4">
                  {userStatus?.isPremium ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-full">
                      <Crown className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-amber-800">Premium User</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full">
                      <Star className="w-5 h-5 text-slate-600" />
                      <span className="font-medium text-slate-700">Free User</span>
                    </div>
                  )}
                </div>
                <p className="text-lg text-slate-600 mb-2">Halo, {user?.displayName || user?.email?.split('@')[0]}!</p>
                <p className="text-slate-500">Pilih layanan dari menu untuk memulai perjalanan karir digital Anda.</p>
              </div>
            </div>

            {/* Premium Upgrade Card */}
            {!userStatus?.isPremium && (
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border border-blue-200/50 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-blue-200/50 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">Upgrade Premium</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Buka Semua Fitur AI Career</h3>
                  <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
                    Dapatkan akses penuh ke semua layanan AI untuk mengakselerasi pertumbuhan karir digital Anda.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: RocketIcon, title: "AI Improve", desc: "Jalur karir personal" },
                    { icon: Globe2, title: "AI Interview", desc: "Latihan interview" },
                    { icon: Target, title: "AI Project", desc: "Pengembangan portofolio" },
                    { icon: BookOpenCheck, title: "AI Test", desc: "Tes kemampuan teknis" },
                    { icon: BrainCircuit, title: "AI Work", desc: "Simulasi kerja real" },
                    { icon: Users, title: "Priority Support", desc: "Dukungan prioritas" }
                  ].map((feature, index) => (
                    <div key={index} className="bg-white/80 border border-blue-200/50 rounded-xl p-4 text-center">
                      <feature.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-slate-800 mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    Rp 99,000 <span className="text-lg font-normal text-slate-500">/bulan</span>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="group relative px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    <div className="relative z-10 flex items-center justify-center text-white">
                      <span>Upgrade Sekarang</span>
                      <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
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
                <div key={index} className="bg-white/80 border border-blue-200/50 rounded-xl p-6 text-center">
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
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      <div className="sidebar">
        <div className="sidebar-header">
          <h3 className="text-xl font-bold">AI Career</h3>
          {userStatus?.isPremium && (
            <div className="flex items-center gap-2 text-amber-400 text-sm mt-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-200/30">
              <Crown className="w-4 h-4" />
              <span className="font-medium">Premium</span>
            </div>
          )}
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeRoute === item.id ? 'active' : ''} ${
                item.isPremium && !userStatus?.isPremium ? 'locked' : ''
              }`}
              onClick={() => handleNavigation(item)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.isPremium && !userStatus?.isPremium && (
                  <Lock className="w-4 h-4 text-amber-400" />
                )}
              </div>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <p className="font-medium">{user?.displayName || user?.email?.split('@')[0]}</p>
            <p className="text-xs opacity-70">
              {userStatus?.isPremium ? 'Premium Account' : 'Free Account'}
            </p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <header className="header">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        </header>
        <main className="content">
          {renderContent()}
        </main>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
                <Crown className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium">Premium Plan</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-800">Upgrade ke Premium</h3>
              <p className="text-slate-600">Buka semua fitur AI Career untuk mengakselerasi karir Anda</p>
            </div>
            
            {/* Payment Error Display */}
            {paymentError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
            
            <div className="space-y-3 mb-6">
              {[
                "Akses semua fitur AI Career",
                "Rekomendasi karir berbasis AI",
                "Simulasi interview tak terbatas",
                "Dukungan prioritas 24/7",
                "Analisis mendalam portofolio",
                "Proyek real dari UMKM"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                Rp 24,900 <span className="text-lg font-normal text-slate-500">/bulan</span>
              </div>
              <p className="text-sm text-slate-500">Batalkan kapan saja • Link expires dalam 30 menit</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setPaymentError(null);
                  setExpiredTransaction(null);
                }}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                disabled={paymentLoading}
              >
                Nanti Saja
              </button>
              <button
                onClick={handleUpgradeToPremium}
                disabled={paymentLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-medium"
              >
                {paymentLoading ? 'Memproses...' : 'Upgrade Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
        }

        .sidebar {
          width: 280px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(148, 163, 184, 0.2);
          color: #334155;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
        }

        .nav-item {
          display: block;
          width: 100%;
          padding: 14px 24px;
          background: none;
          border: none;
          color: #64748b;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          font-medium: 500;
          border-radius: 0;
          margin: 2px 12px;
          border-radius: 12px;
        }

        .nav-item:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .nav-item.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .nav-item.locked {
          opacity: 0.6;
        }
        .nav-item.locked:hover {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid rgba(148, 163, 184, 0.2);
        }

        .user-info {
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(248, 250, 252, 0.8);
          rounded: 12px;
          border-radius: 12px;
        }

        .user-info p {
          margin: 0;
          color: #475569;
        }

        .logout-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .logout-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: transparent;
        }

        .header {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 24px 32px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }

        .content {
          flex: 1;
          padding: 32px;
        }

        .content-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 32px;
          border-radius: 20px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          max-width: 1000px;
        }

        .content-card h2 {
          margin: 0;
          color: #1e293b;
          font-weight: 700;
        }

        .content-card p {
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        }

        .loading {
          font-size: 1.2rem;
          color: #475569;
          font-weight: 500;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          padding: 32px;
          border-radius: 20px;
          max-width: 480px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
          }
          
          .sidebar-nav {
            display: flex;
            overflow-x: auto;
            padding: 16px;
          }
          
          .nav-item {
            white-space: nowrap;
            min-width: 140px;
            margin: 0 6px;
          }
          
          .content {
            padding: 20px;
          }
          
          .modal-content {
            padding: 24px;
            margin: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
