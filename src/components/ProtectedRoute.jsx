import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserStatus } from '../lib/firebase';
import { Crown, Lock, ArrowRight } from 'lucide-react';

const ProtectedRoute = ({ children, requiresPremium = false }) => {
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
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
                onClick={() => navigate('/payment')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                Upgrade to Premium
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full border border-slate-300 text-slate-700 py-3 px-6 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mt-4">
              Starting from Rp 99,000/month
            </p>
          </div>
        </div>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;

