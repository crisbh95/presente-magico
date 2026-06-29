import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../supabase/config';
import type { User } from '@supabase/supabase-js';
import { getProfile, type UserProfile } from '../services/db';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isPremium: boolean;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isPremium = profile?.plan === 'premium' || profile?.role === 'admin';
  const isAdmin = profile?.role === 'admin' || user?.email === 'crisbh95@gmail.com' || user?.email === 'contato@presentemagico.com.br';

  const loadProfile = async (userId: string) => {
    const data = await getProfile(userId);
    setProfile(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id).then(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoading(true);
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let profileSubscription: any = null;
    if (user?.id) {
      profileSubscription = supabase.channel('custom-update-channel')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          (payload) => {
            console.log('Profile updated realtime:', payload);
            loadProfile(user.id);
          }
        )
        .subscribe();
    }
    return () => {
      if (profileSubscription) profileSubscription.unsubscribe();
    };
  }, [user?.id]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isPremium, isAdmin, loading, signInWithGoogle, logout, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
