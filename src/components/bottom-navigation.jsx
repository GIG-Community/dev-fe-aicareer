import React, { useState } from 'react';
import { Crown, Lock, TrendingUp, RocketIcon, Globe2, Target, BookOpenCheck, BrainCircuit, Gift, User, LogOut, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', isPremium: false, icon: TrendingUp },
  { id: 'ainterview', label: 'Interview', path: '/ainterview', isPremium: true, icon: Globe2 },
  { id: 'aitest', label: 'Test', path: '/aitest', isPremium: true, icon: BookOpenCheck },
  { id: 'aiwork', label: 'Work', path: '/aiwork', isPremium: true, icon: BrainCircuit },
  { id: 'aigacha', label: 'Gacha', path: '/aigacha', isPremium: false, icon: Gift }
];

const BottomNavigation = ({ 
  userStatus, 
  user, 
  onLogout,
  onUpgradeClick 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentRoute = () => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.id : 'dashboard';
  };

  const handleNavigation = (item) => {
    if (item.isPremium && !userStatus?.isPremium) {
      if (onUpgradeClick) {
        onUpgradeClick();
      }
      return;
    }
    navigate(item.path);
    setShowUserMenu(false);
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
  };

  const activeRoute = getCurrentRoute();

  return (
    <>
      {/* User Menu Overlay */}
      {showUserMenu && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowUserMenu(false)}>
          <div className="absolute bottom-20 right-4 left-4 glass-card p-4 rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200/50">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">
                  {user?.displayName || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-slate-500">
                  {userStatus?.isPremium ? 'Premium Account' : 'Free Account'}
                </p>
              </div>
              {userStatus?.isPremium && (
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full border border-amber-200">
                  <Crown className="w-3 h-3 text-amber-600" />
                  <span className="text-xs font-medium text-amber-800">Premium</span>
                </div>
              )}
            </div>
            
            {!userStatus?.isPremium && (
              <button 
                onClick={() => {
                  setShowUserMenu(false);
                  if (onUpgradeClick) onUpgradeClick();
                }}
                className="w-full flex items-center gap-3 p-3 mb-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-medium"
              >
                <Crown className="w-4 h-4" />
                Upgrade ke Premium
              </button>
            )}
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
        <div className="glass-card border-t border-slate-200/50 px-2 py-2">
          <div className="flex items-center justify-around">
            {menuItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-0 flex-1 ${
                  activeRoute === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'text-slate-600'
                } ${item.isPremium && !userStatus?.isPremium ? 'opacity-60' : ''}`}
                onClick={() => handleNavigation(item)}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {item.isPremium && !userStatus?.isPremium && (
                    <Lock className="w-2.5 h-2.5 text-amber-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <span className="text-xs font-medium truncate">{item.label}</span>
              </button>
            ))}
            
            {/* User Menu Button */}
            <button
              onClick={handleUserMenuToggle}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-0 flex-1 text-slate-600"
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNavigation;
