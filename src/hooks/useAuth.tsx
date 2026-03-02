import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  loading: boolean;
  demoLogin: () => void;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
  loading: true,
  demoLogin: () => {},
  isDemo: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const demoMode = localStorage.getItem('vybe_demo_mode') === 'true';
    if (demoMode) {
      setIsDemo(true);
      setUser({ id: 'demo-user-id', email: 'demo@vybe.bio' } as User);
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      // Listen for changes on auth state (logged in, signed out, etc.)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isDemo) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } catch (e) {
      console.warn('Supabase not configured, auth features disabled.');
      setLoading(false);
    }
  }, [isDemo]);

  const signOut = async () => {
    if (isDemo) {
      setIsDemo(false);
      setUser(null);
      localStorage.removeItem('vybe_demo_mode');
      return;
    }
    await supabase.auth.signOut();
  };

  const demoLogin = () => {
    setIsDemo(true);
    setUser({ id: 'demo-user-id', email: 'demo@vybe.bio' } as User);
    localStorage.setItem('vybe_demo_mode', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, session, signOut, loading, demoLogin, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
