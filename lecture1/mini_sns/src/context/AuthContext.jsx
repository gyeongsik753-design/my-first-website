import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 로그아웃 시 프로필 초기화
      setProfile(null);
      return;
    }
    supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [session]);

  const signUp = async ({ email, password, username, displayName }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: displayName },
      },
    });
    return { error };
  };

  const signIn = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (!session?.user) return;
    const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();
    setProfile(data);
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- Provider와 짝을 이루는 훅이라 한 파일에 둠
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
