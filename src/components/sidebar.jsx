import React from 'react';
import { Crown, Lock, TrendingUp, RocketIcon, Globe2, Target, BookOpenCheck, BrainCircuit, Award, Gift } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', isPremium: false, icon: TrendingUp },
//   { id: 'aimprove', label: 'AI Improve', path: '/aimprove', isPremium: true, icon: RocketIcon },
  { id: 'ainterview', label: 'AI Interview', path: '/ainterview', isPremium: true, icon: Globe2 },
  { id: 'aiproject', label: 'AI Project', path: '/aiproject', isPremium: true, icon: Target },
  { id: 'aitest', label: 'AI Test', path: '/aitest', isPremium: true, icon: BookOpenCheck },
  { id: 'aiwork', label: 'AI Work', path: '/aiwork', isPremium: true, icon: BrainCircuit },
  { id: 'aigacha', label: 'AI Gacha', path: '/aigacha', isPremium: false, icon: Gift }
];

const Sidebar = ({ 
  collapsed, 
  onToggle, 
  activeRoute, 
  userStatus, 
  user, 
  onNavigation, 
  onLogout 
}) => {
  return (
    <div className={`hidden lg:flex ${collapsed ? 'w-20' : 'w-72'} glass-card border-r transition-all duration-300 flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold transition-opacity ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
            AI Career
          </h3>
          <button 
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
            title="Toggle Sidebar"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        {userStatus?.isPremium && !collapsed && (
          <div className="flex items-center gap-2 text-amber-600 text-sm mt-3 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
            <Crown className="w-4 h-4" />
            <span className="font-medium">Premium</span>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 p-3 mb-2 rounded-xl transition-all ${
              activeRoute === item.id 
                ? 'bg-gradient-to-r from-blue-500 to-purple-blue text-white shadow-lg' 
                : 'hover:bg-blue-50 text-slate-600'
            } ${item.isPremium && !userStatus?.isPremium ? 'opacity-60' : ''}`}
            onClick={() => onNavigation(item)}
            title={`${item.label} ${item.isPremium && !userStatus?.isPremium ? '(Premium)' : ''}`}
          >
            <item.icon className="w-5 h-5" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.isPremium && !userStatus?.isPremium && (
                  <Lock className="w-4 h-4 text-amber-500" />
                )}
              </>
            )}
          </button>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-200/50">
        {!collapsed && (
          <div className="glass-card-secondary p-3 mb-3 rounded-xl">
            <p className="font-medium text-slate-800">{user?.displayName || user?.email?.split('@')[0]}</p>
            <p className="text-xs text-slate-500">
              {userStatus?.isPremium ? 'Premium Account' : 'Free Account'}
            </p>
          </div>
        )}
        <button 
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl hover:shadow-lg transition-all" 
          onClick={onLogout}
        >
          {collapsed ? '⇤' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
