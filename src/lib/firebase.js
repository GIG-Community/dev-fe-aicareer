// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc, setDoc, serverTimestamp, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Ekspor instance Auth, Firestore, and Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Atur persistensi otentikasi (misalnya, local persistence)
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Error setting persistence:", err);
});

// Payment transaction storage
// Removed duplicate import - now using consolidated import above

// User status management functions
// Removed duplicate import - now using consolidated import above

export const getUserStatus = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        isPremium: userData.isPremium || false,
        plan: userData.plan || 'free',
        paymentStatus: userData.paymentStatus || 'none',
        premiumExpiry: userData.premiumExpiry || null,
        lastPayment: userData.lastPayment || null,
        ...userData
      };
    } else {
      // Create default user status if doesn't exist
      const defaultStatus = {
        isPremium: false,
        plan: 'free',
        paymentStatus: 'none',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userRef, defaultStatus);
      return defaultStatus;
    }
  } catch (error) {
    console.error('Error getting user status:', error);
    throw error;
  }
};

// Utility function to clean undefined/null values from objects
const cleanFirebaseData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value) && value.constructor === Object) {
        // Recursively clean nested objects
        const cleanedNested = cleanFirebaseData(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
};

export const updateUserStatus = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Clean the updates object to remove undefined/null values
    const cleanedUpdates = cleanFirebaseData(updates);
    
    const updateData = {
      ...cleanedUpdates,
      updatedAt: serverTimestamp()
    };
    
    // Check if document exists
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      await updateDoc(userRef, updateData);
    } else {
      // Create new document with updates
      await setDoc(userRef, {
        ...updateData,
        createdAt: serverTimestamp()
      });
    }
    
    console.log('User status updated successfully');
  } catch (error) {
    console.error('Error updating user status:', error);
    console.error('Update data that caused error:', updates);
    throw error;
  }
};

export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Clean the profile data
    const cleanedProfileData = cleanFirebaseData(profileData);
    
    const userData = {
      ...cleanedProfileData,
      isPremium: false,
      plan: 'free',
      paymentStatus: 'none',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userRef, userData);
    console.log('User profile created successfully');
    return userData;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Enhanced payment transaction storage
export const storePaymentTransaction = async (transactionData) => {
  try {
    // Check if user is authenticated first
    if (!auth.currentUser) {
      console.warn('User not authenticated, skipping Firebase storage');
      return null;
    }

    // Clean the transaction data
    const cleanedTransactionData = cleanFirebaseData(transactionData);

    const docRef = await addDoc(collection(db, 'transactions'), {
      ...cleanedTransactionData,
      userId: auth.currentUser.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Transaction stored with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error storing transaction:', error);
    // Don't throw error, just return null
    return null;
  }
};

export const updatePaymentStatus = async (transactionId, status, paymentData = {}) => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    
    // Clean the payment data
    const cleanedPaymentData = cleanFirebaseData(paymentData);
    
    await updateDoc(transactionRef, {
      status,
      paymentData: cleanedPaymentData,
      updatedAt: serverTimestamp()
    });
    
    console.log('Payment status updated:', { transactionId, status });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Function to get user transactions
export const getUserTransactions = async (userId) => {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const transactions = [];
    
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return transactions;
  } catch (error) {
    console.error('Error getting user transactions:', error);
    throw error;
  }
};