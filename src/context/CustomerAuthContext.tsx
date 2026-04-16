"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase";

interface CustomerProfile {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
}

interface CustomerAuthContextValue {
  user: User | null;
  session: Session | null;
  profile: CustomerProfile | null;
  isLoading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signInWithApple: (redirectTo?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  sendPasswordReset: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const profile: CustomerProfile | null = user
    ? {
        name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        email: user.email ?? null,
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      }
    : null;

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    const supabase = createSupabaseBrowserClient();
    const baseUrl = window.location.origin;
    const next = redirectTo ?? window.location.pathname + window.location.search;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  }, []);

  const signInWithApple = useCallback(async (redirectTo?: string) => {
    const supabase = createSupabaseBrowserClient();
    const baseUrl = window.location.origin;
    const next = redirectTo ?? window.location.pathname + window.location.search;
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { error: error?.message ?? null };
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut({ scope: "local" });
  }, []);

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signInWithGoogle,
        signInWithApple,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        signOut,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used inside CustomerAuthProvider");
  return ctx;
}
