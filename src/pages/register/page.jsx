import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth, createUserProfile } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (error) setError('');
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Nama lengkap harus diisi';
        if (value.trim().length < 2) return 'Nama minimal 2 karakter';
        return '';
      case 'email':
        if (!value.trim()) return 'Email harus diisi';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Format email tidak valid';
        return '';
      case 'password':
        if (!value) return 'Password harus diisi';
        if (value.length < 6) return 'Password minimal 6 karakter';
        return '';
      case 'confirmPassword':
        if (!value) return 'Konfirmasi password harus diisi';
        if (value !== formData.password) return 'Password tidak sama';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFirebaseErrorMessage = (error) => {
    console.error('Firebase Error Details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });

    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.';
      case 'auth/invalid-email':
        return 'Format email tidak valid';
      case 'auth/weak-password':
        return 'Password terlalu lemah. Gunakan minimal 6 karakter.';
      case 'auth/network-request-failed':
        return 'Koneksi jaringan bermasalah. Periksa internet Anda.';
      case 'auth/configuration-not-found':
        return 'Konfigurasi Firebase bermasalah. Periksa environment variables atau hubungi administrator.';
      case 'auth/api-key-not-valid':
        return 'API Key Firebase tidak valid. Hubungi administrator.';
      case 'auth/project-not-found':
        return 'Project Firebase tidak ditemukan. Hubungi administrator.';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan. Silakan coba lagi nanti.';
      default:
        return `Error: ${error.message || 'Terjadi kesalahan saat mendaftar'}`;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Membuat user dengan email dan password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );
      
      const user = userCredential.user;

      // Update profile user dengan nama
      await updateProfile(user, {
        displayName: formData.fullName.trim()
      });

      // Menyimpan data user dengan status default ke Firestore
      await createUserProfile(user.uid, {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        profileCompleted: false
      });

      setSuccess('Registrasi berhasil! Mengalihkan ke dashboard...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      setError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "w-full pl-10 pr-4 py-3 border rounded-xl bg-white/50 placeholder-slate-400 text-slate-800 focus:outline-none transition-all duration-300";
    const errorClass = fieldErrors[fieldName] ? "border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500" : "border-blue-200/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500";
    return `${baseClass} ${errorClass}`;
  };

  const getPasswordInputClassName = (fieldName) => {
    const baseClass = "w-full pl-10 pr-12 py-3 border rounded-xl bg-white/50 placeholder-slate-400 text-slate-800 focus:outline-none transition-all duration-300";
    const errorClass = fieldErrors[fieldName] ? "border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500" : "border-blue-200/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500";
    return `${baseClass} ${errorClass}`;
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 text-slate-800 font-['Poppins']">
      {/* Improved Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo dan Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Bergabung dengan Aicareer
              </span>
            </h1>
            <p className="text-slate-600">Mulai perjalanan karir digital Anda</p>
          </div>

          {/* Form Container */}
          <div className="bg-white/90 border border-blue-200/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
            <form className="space-y-6" onSubmit={handleRegister}>
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                {/* Full Name Field */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      className={getInputClassName('fullName')}
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.fullName}</p>
                  )}
                </div>

                {/* Email Field */}
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
                      className={getInputClassName('email')}
                      placeholder="Masukkan email Anda"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
                
                {/* Password Field */}
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
                      autoComplete="new-password"
                      required
                      className={getPasswordInputClassName('password')}
                      placeholder="Masukkan password Anda (min. 6 karakter)"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:cursor-not-allowed"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className={getPasswordInputClassName('confirmPassword')}
                      placeholder="Konfirmasi password Anda"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:cursor-not-allowed"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-3 px-4 rounded-xl text-lg font-medium transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <div className="relative z-10 text-white flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? 'Mendaftar...' : 'Daftar'}
                </div>
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300 hover:underline"
                    disabled={loading}
                  >
                    Masuk sekarang
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-slate-600 hover:text-blue-600 transition-colors duration-300 hover:underline disabled:cursor-not-allowed"
              disabled={loading}
            >
              ← Kembali ke beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;