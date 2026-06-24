import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  // Prevent double-initialization race between getSession and onAuthStateChange
  const initialized = useRef(false);

  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Error checking admin role:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Defer to avoid Supabase internal deadlock
          setTimeout(async () => {
            const adminStatus = await checkAdminRole(currentSession.user.id);
            setIsAdmin(adminStatus);
            setIsLoading(false);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsLoading(false);
        }

        initialized.current = true;
      }
    );

    // Hydrate existing session on mount
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      // If onAuthStateChange already fired, skip to avoid double-set
      if (initialized.current) return;

      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        const adminStatus = await checkAdminRole(existingSession.user.id);
        setIsAdmin(adminStatus);
      }

      setIsLoading(false);
      initialized.current = true;
    });

    return () => subscription.unsubscribe();
  }, [checkAdminRole]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const hasAdminRole = await checkAdminRole(data.user.id);
        if (!hasAdminRole) {
          await supabase.auth.signOut();
          throw new Error('Access denied. Admin privileges required.');
        }
        setIsAdmin(true);
      }

      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  }, [checkAdminRole]);

  const signUp = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast.success('Check your email for a verification link!');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAdmin(false);
      toast.success('Signed out successfully');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  }, []);

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };
}
