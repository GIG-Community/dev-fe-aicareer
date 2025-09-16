import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import AuthenticatedLayout from './AuthenticatedLayout';
import PublicLayout from './PublicLayout';

const LayoutWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  // If user is authenticated, use dashboard layout
  if (user) {
    return (
      <AuthenticatedLayout>
        {children}
      </AuthenticatedLayout>
    );
  }

  // If user is not authenticated, use public layout
  return (
    <PublicLayout>
      {children}
    </PublicLayout>
  );
};

export default LayoutWrapper;
