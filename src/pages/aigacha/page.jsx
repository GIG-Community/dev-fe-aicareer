import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, RotateCcw, Zap, Star } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import LayoutWrapper from '../../components/layout/LayoutWrapper';
import gachaService, { GACHA_REWARDS } from '../../services/gachaService';

function GachaContent() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [gachaHistory, setGachaHistory] = useState([]);
  const [canPull, setCanPull] = useState(true);
  const [remainingPulls, setRemainingPulls] = useState(1);
  const [userId, setUserId] = useState('demo-user');
  const [showParticles, setShowParticles] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId('demo-user');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    checkGachaAvailability();
    loadGachaHistory();
  }, [userId]);

  const checkGachaAvailability = async () => {
    const availability = await gachaService.canPullGacha(userId);
    setCanPull(availability.canPull);
    setRemainingPulls(availability.remainingPulls);
  };

  const loadGachaHistory = async () => {
    const history = await gachaService.getGachaHistory(userId);
    setGachaHistory(history);
  };

  const handleGachaPull = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!canPull || isSpinning) return;

    setIsSpinning(true);
    setShowReward(false);
    setShowParticles(true);

    try {
      // Extended spinning animation for more excitement
      setTimeout(async () => {
        const reward = await gachaService.pullGacha(userId);
        setCurrentReward(reward);
        setIsSpinning(false);
        setShowReward(true);
        setShowParticles(false);
        
        // Check if can still pull
        const availability = await gachaService.canPullGacha(userId);
        setCanPull(availability.canPull);
        setRemainingPulls(availability.remainingPulls);
        
        // Reload history
        loadGachaHistory();
      }, 3000); // Longer animation for suspense
    } catch (error) {
      console.error('Gacha pull error:', error);
      setIsSpinning(false);
      setShowParticles(false);
    }
  };

  const getRewardIcon = (type) => {
    const icons = {
      sticker: '🏷️',
      voucher: '🎫',
      keychain: '🔑',
      pin: '📌',
      try_again: '🎯'
    };
    return icons[type] || '🎁';
  };

  const getRarityBorder = (rarity) => {
    const borders = {
      common: 'border-slate-400',
      rare: 'border-blue-400',
      epic: 'border-purple-400',
      special: 'border-amber-400',
      legendary: 'border-yellow-400'
    };
    return borders[rarity] || borders.common;
  };

  const getRarityGlow = (rarity) => {
    const glows = {
      common: 'shadow-slate-500/20',
      rare: 'shadow-blue-500/30',
      epic: 'shadow-purple-500/30',
      special: 'shadow-amber-500/30',
      legendary: 'shadow-yellow-500/30'
    };
    return glows[rarity] || glows.common;
  };

  const nextResetTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 ${user ? 'p-4' : 'p-4 pt-28'} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-800" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Particle Effects */}
      <AnimatePresence>
        {showParticles && (
          <div className="fixed inset-0 pointer-events-none z-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: '50vw', y: '50vh' }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0.5],
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, delay: Math.random() * 0.5 }}
                className="absolute text-2xl"
              >
                ✨
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-4xl relative z-20">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-blue-200/20 mb-6"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-white text-sm font-medium">Daily Lucky Draw</span>
          </motion.div>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              🎰 AI Career Gacha
            </span>
          </h1>
          <p className="text-slate-300 text-lg">Dapatkan hadiah menarik setiap hari!</p>
          
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 border border-blue-200/20">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <span className="text-white font-medium">
                  {canPull ? 'Kesempatan Tersedia!' : `Reset: ${nextResetTime()}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Gacha Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-blue-200/20">
          <div className="text-center">
            {/* Gacha Machine */}
            <motion.div 
              className="relative mx-auto w-80 h-80 mb-8"
              animate={isSpinning ? { 
                rotate: 360,
                scale: [1, 1.1, 1]
              } : { rotate: 0, scale: 1 }}
              transition={{ 
                duration: isSpinning ? 1 : 0.5, 
                repeat: isSpinning ? Infinity : 0, 
                ease: isSpinning ? "linear" : "easeOut"
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 rounded-full border-8 border-amber-300 shadow-2xl shadow-amber-500/30 flex items-center justify-center relative overflow-hidden">
                {/* Inner glow effect */}
                <div className="absolute inset-4 bg-gradient-to-br from-yellow-300/50 to-transparent rounded-full" />
                
                {isSpinning ? (
                  <motion.div 
                    className="text-8xl relative z-10"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                ) : (
                  <motion.div 
                    className="text-8xl relative z-10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    🎁
                  </motion.div>
                )}
              </div>
              
              {/* Floating sparkles around machine */}
              {!isSpinning && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl"
                      style={{
                        top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                        left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 45}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    >
                      ⭐
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>

            {/* Pull Button */}
            <motion.button
              onClick={handleGachaPull}
              disabled={!canPull || isSpinning || !user}
              className={`px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-300 relative overflow-hidden ${
                canPull && !isSpinning && user
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
              whileHover={canPull && !isSpinning && user ? { scale: 1.05, y: -2 } : {}}
              whileTap={canPull && !isSpinning && user ? { scale: 0.98 } : {}}
            >
              {/* Button glow effect */}
              {canPull && !isSpinning && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-2xl" />
              )}
              
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSpinning ? (
                  <>
                    <RotateCcw className="w-6 h-6 animate-spin" />
                    <span>Mengundi...</span>
                  </>
                ) : canPull && user ? (
                  <>
                    <Zap className="w-6 h-6" />
                    <span>Gacha Sekarang!</span>
                  </>
                ) : !user ? (
                  <span>Login untuk Gacha</span>
                ) : (
                  <span>Besok Lagi</span>
                )}
              </div>
            </motion.button>

            {!canPull && (
              <p className="text-slate-400 mt-4 text-sm">
                Reset otomatis setiap hari pada pukul 00:00
              </p>
            )}
          </div>
        </div>

        {/* Reward Display Modal */}
        <AnimatePresence>
          {showReward && currentReward && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowReward(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 50 }}
                className={`bg-white rounded-3xl p-8 max-w-md mx-4 border-4 ${getRarityBorder(currentReward.rarity)} ${getRarityGlow(currentReward.rarity)} shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  {/* Celebration effect */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, times: [0, 0.7, 1] }}
                    className="text-8xl mb-4"
                  >
                    {getRewardIcon(currentReward.type)}
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-2 text-slate-800"
                  >
                    {currentReward.name}
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 mb-4 capitalize font-medium"
                  >
                    {currentReward.rarity === 'special' ? 'Bonus Special' : `Rarity: ${currentReward.rarity}`}
                  </motion.p>
                  
                  {currentReward.type === 'try_again' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-4 rounded-xl mb-4"
                    >
                      <p className="text-amber-700 font-bold text-lg">🎉 Luar Biasa!</p>
                      <p className="text-amber-600 text-sm">Kamu mendapat kesempatan gratis lagi!</p>
                    </motion.div>
                  )}
                  
                  {currentReward.type === 'voucher' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 p-4 rounded-xl mb-4"
                    >
                      <p className="text-blue-700 font-bold">Kode Diskon:</p>
                      <p className="text-blue-600 text-lg font-mono font-bold">19JUTALAPANGANKERJA</p>
                    </motion.div>
                  )}
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => setShowReward(false)}
                    className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                  >
                    Terima Hadiah
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reward History */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-blue-200/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400" />
            Koleksi Hadiah
          </h2>
          {gachaHistory.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gachaHistory.slice(0, 10).map((reward, index) => (
                <motion.div
                  key={reward.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border-2 ${getRarityBorder(reward.rarity)} hover:bg-white/30 transition-all duration-300`}
                >
                  <div className="text-4xl mb-2">{getRewardIcon(reward.type)}</div>
                  <p className="text-white text-sm font-medium leading-tight">{reward.name}</p>
                  <p className="text-slate-300 text-xs capitalize mt-1">{reward.rarity}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🎁</div>
              <p className="text-slate-300">Belum ada hadiah. Mulai gacha pertamamu!</p>
            </div>
          )}
        </div>

        {/* Reward Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-blue-200/20">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            Hadiah yang Tersedia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gachaService.getPublicRewards().map((reward, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-4 hover:bg-white/20 transition-all duration-300"
              >
                <span className="text-3xl">{getRewardIcon(reward.type)}</span>
                <div>
                  <p className="text-white font-medium">{reward.name}</p>
                  <p className="text-slate-300 text-sm capitalize">{reward.rarity}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GachaPage() {
  return (
    <LayoutWrapper>
      <GachaContent />
    </LayoutWrapper>
  );
}
