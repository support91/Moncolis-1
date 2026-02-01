import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  userType: 'client' | 'partner' | 'admin';
  authProvider: 'email' | 'google' | 'whatsapp';
  companyName?: string;
  companyAddress?: string;
  partnerStatus?: 'pending' | 'approved' | 'rejected';
  adminLevel?: 'standard' | 'super';
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string, userType: 'client' | 'partner' | 'admin', extra?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendWhatsAppOTP: (phone: string) => Promise<{ success: boolean; otp?: string }>;
  verifyWhatsAppOTP: (phone: string, otp: string, fullName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        if (session) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          phone: data.phone,
          userType: data.user_type,
          authProvider: data.auth_provider,
          companyName: data.company_name,
          companyAddress: data.company_address,
          partnerStatus: data.partner_status,
          adminLevel: data.admin_level,
          avatarUrl: data.avatar_url
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    userType: 'client' | 'partner' | 'admin',
    extra?: {
      companyName?: string;
      companyAddress?: string;
      invitationCode?: string;
    }
  ) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Sign up failed');

    const userData: any = {
      id: authData.user.id,
      email,
      full_name: fullName,
      phone,
      user_type: userType,
      auth_provider: 'email',
    };

    if (userType === 'partner' && extra) {
      userData.company_name = extra.companyName;
      userData.company_address = extra.companyAddress;
      userData.partner_status = 'pending';
    }

    if (userType === 'admin' && extra) {
      userData.invitation_code = extra.invitationCode;
      const superAdminCodes = ['SUPER-ADMIN-2026'];
      userData.admin_level = superAdminCodes.includes(extra.invitationCode || '') ? 'super' : 'standard';
    }

    const { error: profileError } = await supabase
      .from('users')
      .insert(userData);

    if (profileError) throw profileError;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (data.user) {
      await loadUserProfile(data.user.id);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  };

  const sendWhatsAppOTP = async (phone: string): Promise<{ success: boolean; otp?: string }> => {
    return { success: true, otp: '123456' };
  };

  const verifyWhatsAppOTP = async (phone: string, otp: string, fullName: string) => {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (existingUser) {
      setUser({
        id: existingUser.id,
        email: existingUser.email,
        fullName: existingUser.full_name,
        phone: existingUser.phone,
        userType: existingUser.user_type,
        authProvider: existingUser.auth_provider,
        avatarUrl: existingUser.avatar_url
      });
      return;
    }

    const virtualEmail = `${phone.replace(/\+/g, '')}@whatsapp.moncolis.sn`;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: virtualEmail,
      password: Math.random().toString(36).slice(-16),
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('WhatsApp registration failed');

    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: virtualEmail,
        full_name: fullName,
        phone,
        user_type: 'client',
        auth_provider: 'whatsapp',
      });

    if (profileError) throw profileError;

    await loadUserProfile(authData.user.id);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    loginWithGoogle,
    sendWhatsAppOTP,
    verifyWhatsAppOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
