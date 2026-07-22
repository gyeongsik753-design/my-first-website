import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
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

  const loadProfile = (userId) => {
    setProfileLoading(true);
    setProfileError(null);
    return supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        setProfile(data ?? null);
        // 회원가입 트리거가 아직 실행되지 않았거나(가입 직후) DB 설정이 안 된 경우를 구분해서 보여줌
        if (error) setProfileError(error.message);
      })
      .catch((err) => {
        setProfile(null);
        setProfileError(err?.message ?? '프로필을 불러오지 못했습니다.');
      })
      .finally(() => setProfileLoading(false));
  };

  useEffect(() => {
    if (!session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 로그아웃 시 프로필 초기화
      setProfile(null);
      setProfileError(null);
      return;
    }
    loadProfile(session.user.id);
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
    await loadProfile(session.user.id);
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    profileLoading,
    profileError,
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
