const GACHA_REWARDS = {
  STICKER: { type: 'snack and sticker', name: 'Stiker Eksklusif AiCareer + Snack', rarity: 'Common', probability: 30 },
  VOUCHER: { type: 'voucher', name: 'Voucher Diskon', rarity: 'Rare', probability: 20},
  KEYCHAIN: { type: 'keychain', name: 'Gantungan Kunci Limited', rarity: 'Rare', probability: 5 },
  TRY_AGAIN: { type: 'try_again', name: 'Kesempatan Bonus!', rarity: 'Special', probability: 10 },
  PREMIUM: { type: 'premium', name: 'Langganan Premium 1 Bulan gratis', rarity: 'Legendary', probability: 20 },
};

class GachaService {
  constructor() {
    this.STORAGE_KEYS = {
      HISTORY: 'gacha_history',
      DAILY_PULLS: 'gacha_daily_pulls',
      LAST_PULL_DATE: 'gacha_last_pull_date'
    };
  }

  // Generate random reward based on probability
  generateReward() {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const reward of Object.values(GACHA_REWARDS)) {
      cumulative += reward.probability;
      if (random <= cumulative) {
        return {
          ...reward,
          id: Date.now() + Math.random(),
          timestamp: new Date()
        };
      }
    }
    
    return GACHA_REWARDS.STICKER;
  }

  // Check if it's a new day
  isNewDay() {
    const lastPullDate = localStorage.getItem(this.STORAGE_KEYS.LAST_PULL_DATE);
    if (!lastPullDate) return true;
    
    const today = new Date().toDateString();
    return lastPullDate !== today;
  }

  // Get daily pull count
  getDailyPulls() {
    if (this.isNewDay()) {
      localStorage.setItem(this.STORAGE_KEYS.DAILY_PULLS, '0');
      localStorage.setItem(this.STORAGE_KEYS.LAST_PULL_DATE, new Date().toDateString());
      return 0;
    }
    
    return parseInt(localStorage.getItem(this.STORAGE_KEYS.DAILY_PULLS) || '0');
  }

  // Increment daily pull count
  incrementDailyPulls() {
    const currentPulls = this.getDailyPulls();
    localStorage.setItem(this.STORAGE_KEYS.DAILY_PULLS, (currentPulls + 1).toString());
    localStorage.setItem(this.STORAGE_KEYS.LAST_PULL_DATE, new Date().toDateString());
  }

  // Pull gacha (local only)
  async pullGacha(userId) {
    return new Promise((resolve) => {
      // Simulate some processing time
      setTimeout(() => {
        const reward = this.generateReward();
        
        // Save to history
        this.saveToHistory(reward);
        
        // Increment daily pulls
        this.incrementDailyPulls();
        
        // If try again, don't count against daily limit
        if (reward.type === 'try_again') {
          const currentPulls = this.getDailyPulls();
          localStorage.setItem(this.STORAGE_KEYS.DAILY_PULLS, (currentPulls - 1).toString());
        }
        
        resolve(reward);
      }, 100);
    });
  }

  // Save reward to history
  saveToHistory(reward) {
    const history = this.getGachaHistory();
    const newHistory = [reward, ...history.slice(0, 49)]; // Keep last 50 items
    localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
  }

  // Get user's gacha history
  async getGachaHistory(userId) {
    return new Promise((resolve) => {
      const history = localStorage.getItem(this.STORAGE_KEYS.HISTORY);
      resolve(history ? JSON.parse(history) : []);
    });
  }

  // Get gacha history synchronously
  getGachaHistory() {
    const history = localStorage.getItem(this.STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  }

  // Check if user can pull gacha (daily limit of 1)
  async canPullGacha(userId) {
    return new Promise((resolve) => {
      const dailyLimit = 1;
      const dailyPulls = this.getDailyPulls();
      const remainingPulls = Math.max(0, dailyLimit - dailyPulls);
      
      resolve({
        canPull: remainingPulls > 0,
        remainingPulls: remainingPulls,
        dailyPulls: dailyPulls,
        dailyLimit: dailyLimit
      });
    });
  }

  // Get statistics
  getStatistics() {
    const history = this.getGachaHistory();
    const stats = {
      totalPulls: history.length,
      rewardCounts: {},
      rarityCount: {},
      todayPulls: this.getDailyPulls()
    };

    // Count rewards by type and rarity
    history.forEach(reward => {
      stats.rewardCounts[reward.type] = (stats.rewardCounts[reward.type] || 0) + 1;
      stats.rarityCount[reward.rarity] = (stats.rarityCount[reward.rarity] || 0) + 1;
    });

    return stats;
  }

  // Reset daily pulls (for testing)
  resetDailyPulls() {
    localStorage.removeItem(this.STORAGE_KEYS.DAILY_PULLS);
    localStorage.removeItem(this.STORAGE_KEYS.LAST_PULL_DATE);
  }

  // Clear all data (for testing)
  clearAllData() {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Get reward rarity color (using homepage colors)
  getRarityColor(rarity) {
    const colors = {
      common: '#64748b', // slate-500
      rare: '#3b82f6', // blue-500
      epic: '#8b5cf6', // purple-500
      special: '#f59e0b', // amber-500
      legendary: '#eab308' // yellow-500
    };
    return colors[rarity] || colors.common;
  }

  // Get public rewards for display (without probabilities)
  getPublicRewards() {
    return Object.values(GACHA_REWARDS).map(reward => ({
      type: reward.type,
      name: reward.name,
      rarity: reward.rarity
    }));
  }
}

export default new GachaService();
export { GACHA_REWARDS };
