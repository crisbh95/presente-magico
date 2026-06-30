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

  const isAdmin = profile?.role === 'admin' || user?.email === 'crisbh95@gmail.com' || user?.email === 'contato@presentemagico.com.br';
  const isPremium = profile?.plan === 'premium' || isAdmin;

  const loadProfile = async (userId: string) => {
    try {
      const data = await getProfile(userId);
      setProfile(data);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      setProfile(null);
    }
  };

  useEffect(() => {
    let active = true;

    async function initSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (active) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadProfile(session.user.id);
          } else {
            setProfile(null);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar sessão inicial:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoading(true);
        try {
          await loadProfile(session.user.id);
        } catch (err) {
          console.error("Erro no onAuthStateChange loadProfile:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    return () => {
      active = false;
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
