import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getUserStatus } from '../../lib/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar';
import { Crown } from 'lucide-react';

const AuthenticatedLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get active route from current path
  const getActiveRoute = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path.startsWith('/aimprove')) return 'aimprove';
    if (path.startsWith('/ainterview')) return 'ainterview';
    if (path.startsWith('/aiproject')) return 'aiproject';
    if (path.startsWith('/aitest')) return 'aitest';
    if (path.startsWith('/aiwork')) return 'aiwork';
    if (path.startsWith('/aigacha')) return 'aigacha';
    return 'dashboard';
  };

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
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigation = (item) => {
    // Check if premium feature and user is not premium
    if (item.isPremium && !userStatus?.isPremium) {
      // Show upgrade modal or notification
      alert(`${item.label} adalah fitur premium. Silakan upgrade untuk mengakses.`);
      return;
    }
    
    // Navigate to the route
    navigate(item.path);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return children; // Return children without layout for non-authenticated users
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="hero-grid"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeRoute={getActiveRoute()}
        userStatus={userStatus}
        user={user}
        onNavigation={handleNavigation}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="glass-card p-6 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            {getActiveRoute().charAt(0).toUpperCase() + getActiveRoute().slice(1).replace('ai', 'AI ')}
          </h1>
          {userStatus?.isPremium && (
            <div className="flex items-center gap-2 text-amber-600">
              <Crown className="w-5 h-5" />
              <span className="font-medium">Premium</span>
            </div>
          )}
        </header>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
