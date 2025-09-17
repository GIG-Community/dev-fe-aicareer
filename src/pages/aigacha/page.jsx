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

  // Add continuous background particles animation
  const BackgroundParticles = () => (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // Add floating sparkles component
  const FloatingSparkles = () => (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300"
          style={{
            fontSize: Math.random() * 10 + 15,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-20, 20, -20],
            rotate: [0, 360],
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 ${user ? 'p-4' : 'p-4 pt-28'} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-800"
          animate={{
            background: [
              "linear-gradient(to bottom right, #0f172a, #1e3a8a, #1e293b)",
              "linear-gradient(to bottom right, #1e293b, #3730a3, #0f172a)",
              "linear-gradient(to bottom right, #0f172a, #1e3a8a, #1e293b)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [-50, 50, -50],
            y: [-30, 30, -30],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [30, -30, 30],
            y: [20, -20, 20],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Continuous Background Particles */}
      <BackgroundParticles />

      {/* Floating Sparkles */}
      <FloatingSparkles />

      {/* Particle Effects */}
      <AnimatePresence>
        {showParticles && (
          <div className="fixed inset-0 pointer-events-none z-10">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: '50vw', y: '50vh' }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.5, 0.5],
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  rotate: [0, 360]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, delay: Math.random() * 0.8 }}
                className="absolute text-2xl"
              >
                {['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)]}
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-blue-200/20 mb-6 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: [-200, 200] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>
            <span className="text-white text-sm font-medium relative z-10">Daily Lucky Draw</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold text-white mb-4"
            animate={{
              textShadow: [
                "0 0 20px rgba(59, 130, 246, 0.5)",
                "0 0 30px rgba(147, 51, 234, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              🎰 AI Career Gacha
            </span>
          </motion.h1>
          <motion.p 
            className="text-slate-300 text-lg"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Dapatkan hadiah menarik setiap hari!
          </motion.p>
          
          <div className="mt-6 flex items-center justify-center gap-4">
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 border border-blue-200/20 relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 30px rgba(147, 51, 234, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: [-300, 300] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className="flex items-center gap-2 relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Gift className="w-5 h-5 text-amber-400" />
                </motion.div>
                <span className="text-white font-medium">
                  {canPull ? 'Kesempatan Tersedia!' : `Reset: ${nextResetTime()}`}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Gacha Container */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-blue-200/20 relative overflow-hidden"
          animate={{
            boxShadow: [
              "0 0 40px rgba(59, 130, 246, 0.1)",
              "0 0 60px rgba(147, 51, 234, 0.1)",
              "0 0 40px rgba(59, 130, 246, 0.1)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: [-500, 500] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-center relative z-10">
            {/* Gacha Machine */}
            <motion.div 
              className="relative mx-auto w-80 h-80 mb-8"
              animate={isSpinning ? { 
                rotate: 360,
                scale: [1, 1.1, 1]
              } : { 
                rotate: [0, 5, -5, 0], 
                scale: [1, 1.02, 1],
                y: [-5, 5, -5]
              }}
              transition={isSpinning ? { 
                duration: 1, 
                repeat: Infinity, 
                ease: "linear"
              } : {
                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <motion.div 
                className="w-full h-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 rounded-full border-8 border-amber-300 shadow-2xl shadow-amber-500/30 flex items-center justify-center relative overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 0 40px rgba(245, 158, 11, 0.3)",
                    "0 0 60px rgba(245, 158, 11, 0.5)",
                    "0 0 40px rgba(245, 158, 11, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Inner glow effect */}
                <motion.div 
                  className="absolute inset-4 bg-gradient-to-br from-yellow-300/50 to-transparent rounded-full"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {isSpinning ? (
                  <motion.div 
                    className="text-8xl relative z-10"
                    animate={{ 
                      rotate: 360, 
                      scale: [1, 1.3, 1],
                      filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"]
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                ) : (
                  <motion.div 
                    className="text-8xl relative z-10"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    🎁
                  </motion.div>
                )}
              </motion.div>
              
              {/* Floating sparkles around machine */}
              {!isSpinning && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl"
                      style={{
                        top: `${20 + Math.sin(i * 45 * Math.PI / 180) * 40}%`,
                        left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 45}%`,
                      }}
                      animate={{
                        y: [-15, 15, -15],
                        x: [-10, 10, -10],
                        opacity: [0.3, 1, 0.3],
                        rotate: [0, 360],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 3 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    >
                      {['⭐', '✨', '🌟', '💫'][i % 4]}
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
              whileHover={canPull && !isSpinning && user ? { scale: 1.08, y: -3 } : {}}
              whileTap={canPull && !isSpinning && user ? { scale: 0.95 } : {}}
              animate={canPull && !isSpinning && user ? {
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(147, 51, 234, 0.4)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Button glow effect */}
              {canPull && !isSpinning && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                  animate={{
                    background: [
                      "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
                      "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))",
                      "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSpinning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCcw className="w-6 h-6" />
                    </motion.div>
                    <span>Mengundi...</span>
                  </>
                ) : canPull && user ? (
                  <>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, -15, 0]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Zap className="w-6 h-6" />
                    </motion.div>
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
              <motion.p 
                className="text-slate-400 mt-4 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Reset otomatis setiap hari pada pukul 00:00
              </motion.p>
            )}
          </div>
        </motion.div>

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
                initial={{ scale: 0.3, opacity: 0, y: 100, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotateY: 0 }}
                exit={{ scale: 0.3, opacity: 0, y: 100, rotateY: -180 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  rotateY: { duration: 0.8 }
                }}
                className={`bg-white rounded-3xl p-8 max-w-md mx-4 border-4 ${getRarityBorder(currentReward.rarity)} ${getRarityGlow(currentReward.rarity)} shadow-2xl relative overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Celebration particles inside modal */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-400"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        fontSize: Math.random() * 8 + 12
                      }}
                      animate={{
                        y: [-20, 20, -20],
                        x: [-15, 15, -15],
                        opacity: [0, 1, 0],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>

                <div className="text-center relative z-10">
                  {/* Celebration effect */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: [0, 1.3, 1],
                      rotate: [0, 360, 0]
                    }}
                    transition={{ duration: 1, times: [0, 0.6, 1] }}
                    className="text-8xl mb-4"
                  >
                    {getRewardIcon(currentReward.type)}
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold mb-2 text-slate-800"
                  >
                    {currentReward.name}
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-slate-600 mb-4 capitalize font-medium"
                  >
                    {currentReward.rarity === 'special' ? 'Bonus Special' : `Rarity: ${currentReward.rarity}`}
                  </motion.p>
                  
                  {currentReward.type === 'try_again' && (
                    <motion.div 
                      initial={{ scale: 0, rotateX: 90 }}
                      animate={{ scale: 1, rotateX: 0 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                      className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-4 rounded-xl mb-4 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/50 to-transparent"
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-amber-700 font-bold text-lg relative z-10">🎉 Luar Biasa!</p>
                      <p className="text-amber-600 text-sm relative z-10">Kamu mendapat kesempatan gratis lagi!</p>
                    </motion.div>
                  )}
                  
                  {currentReward.type === 'voucher' && (
                    <motion.div 
                      initial={{ scale: 0, rotateX: 90 }}
                      animate={{ scale: 1, rotateX: 0 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 p-4 rounded-xl mb-4 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent"
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-blue-700 font-bold relative z-10">Kode Diskon:</p>
                      <p className="text-blue-600 text-lg font-mono font-bold relative z-10">19JUTALAPANGANKERJA</p>
                    </motion.div>
                  )}
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    onClick={() => setShowReward(false)}
                    className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative z-10">Terima Hadiah</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reward History */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-blue-200/20 relative overflow-hidden"
          animate={{
            boxShadow: [
              "0 0 30px rgba(59, 130, 246, 0.1)",
              "0 0 45px rgba(147, 51, 234, 0.1)",
              "0 0 30px rgba(59, 130, 246, 0.1)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent"
            animate={{ x: [-600, 600] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-6 h-6 text-amber-400" />
            </motion.div>
            Koleksi Hadiah
          </h2>
          {gachaHistory.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 relative z-10">
              {gachaHistory.slice(0, 10).map((reward, index) => (
                <motion.div
                  key={reward.id || index}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                  }}
                  className={`bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border-2 ${getRarityBorder(reward.rarity)} hover:bg-white/30 transition-all duration-300 relative overflow-hidden cursor-pointer`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: index * 0.2 }}
                  />
                  <motion.div 
                    className="text-4xl mb-2 relative z-10"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                  >
                    {getRewardIcon(reward.type)}
                  </motion.div>
                  <p className="text-white text-sm font-medium leading-tight relative z-10">{reward.name}</p>
                  <p className="text-slate-300 text-xs capitalize mt-1 relative z-10">{reward.rarity}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 relative z-10">
              <motion.div 
                className="text-6xl mb-4 opacity-50"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🎁
              </motion.div>
              <p className="text-slate-300">Belum ada hadiah. Mulai gacha pertamamu!</p>
            </div>
          )}
        </motion.div>

        {/* Reward Info */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-blue-200/20 relative overflow-hidden"
          animate={{
            boxShadow: [
              "0 0 25px rgba(59, 130, 246, 0.1)",
              "0 0 35px rgba(147, 51, 234, 0.1)",
              "0 0 25px rgba(59, 130, 246, 0.1)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent"
            animate={{ x: [-700, 700] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Gift className="w-5 h-5 text-amber-400" />
            </motion.div>
            Hadiah yang Tersedia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {gachaService.getPublicRewards().map((reward, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  x: 5,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
                }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 flex items-center space-x-4 hover:bg-white/20 transition-all duration-300 relative overflow-hidden cursor-pointer"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  animate={{ x: [-150, 150] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                />
                <motion.span 
                  className="text-3xl relative z-10"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                >
                  {getRewardIcon(reward.type)}
                </motion.span>
                <div className="relative z-10">
                  <p className="text-white font-medium">{reward.name}</p>
                  <motion.p 
                    className="text-slate-300 text-sm capitalize"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                  >
                    {reward.rarity}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
