import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect jika user sudah login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Terjadi kesalahan saat masuk';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email tidak ditemukan. Silakan daftar terlebih dahulu.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Password salah. Silakan coba lagi.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Format email tidak valid';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Konfigurasi Firebase tidak ditemukan. Silakan hubungi administrator.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Koneksi jaringan bermasalah. Silakan coba lagi.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Email atau password salah';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Terlalu banyak percobaan login. Silakan coba lagi nanti.';
          break;
        default:
          errorMessage = error.message || 'Terjadi kesalahan saat masuk';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 text-slate-800 font-['Poppins']">
      {/* Background dengan efek yang sama seperti homepage */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo dan Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Masuk ke Aicareer
              </span>
            </h1>
            <p className="text-slate-600">Lanjutkan perjalanan karir digital Anda</p>
          </div>

          {/* Form Container */}
          <div className="bg-white/80 border border-blue-200/50 rounded-2xl p-8 backdrop-blur-sm">
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-blue-200/50 rounded-xl bg-white/50 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="w-full pl-10 pr-12 py-3 border border-blue-200/50 rounded-xl bg-white/50 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-3 px-4 rounded-xl text-lg font-medium transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <div className="relative z-10 text-white">
                  {loading ? 'Masuk...' : 'Masuk'}
                </div>
              </button>

              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300"
                  >
                    Daftar sekarang
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-slate-600 hover:text-blue-600 transition-colors duration-300"
            >
              ← Kembali ke beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;