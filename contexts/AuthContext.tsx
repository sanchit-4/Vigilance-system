import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, AuthError } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

type Guard = Database['public']['Tables']['guards']['Row'];

interface AuthContextType {
    user: User | null;
    guard: Guard | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string, name: string, role: 'admin' | 'supervisor' | 'guard') => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    hasRole: (roles: string[]) => boolean;
    isAdmin: () => boolean;
    isSupervisor: () => boolean;
    isGuard: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [guard, setGuard] = useState<Guard | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            setInitialLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setInitialLoading(false);
            
            // Fetch guard data in background after setting user
            if (session?.user) {
                fetchGuardData(session.user.id);
            }
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    // Fetch guard data in background
                    fetchGuardData(session.user.id);
                } else {
                    setGuard(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchGuardData = async (userId: string) => {
        try {
            // Prevent multiple calls for same user
            if (guard && guard.user_id === userId) return;
            
            setLoading(true);
            const { data, error } = await supabase
                .from('guards')
                .select('id, name, role, user_id, is_active, base_salary, category')
                .eq('user_id', userId)
                .maybeSingle();

            if (error) {
                console.error('Error fetching guard data:', error);
                return;
            }

            if (data) {
                setGuard(data);
            }
        } catch (error) {
            console.error('Error fetching guard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setLoading(false);
        }
        return { error };
    };

    const signUp = async (email: string, password: string, name: string, role: 'admin' | 'supervisor' | 'guard') => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { error };
        }

        // Create guard record
        if (data.user) {
            const { error: guardError } = await supabase.from('guards').insert({
                user_id: data.user.id,
                name,
                role,
                contact_info: email,
                base_salary: role === 'admin' ? 5000 : role === 'supervisor' ? 4000 : 3000,
                category: role === 'admin' || role === 'supervisor' ? 'Supervisor' : 'Guard',
                date_of_joining: new Date().toISOString().split('T')[0],
                is_active: true,
            });

            if (guardError) {
                console.error('Error creating guard record:', guardError);
            }
        }

        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setGuard(null);
    };

    const hasRole = (roles: string[]): boolean => {
        return guard ? roles.includes(guard.role || 'guard') : false;
    };

    const isAdmin = (): boolean => {
        return guard?.role === 'admin';
    };

    const isSupervisor = (): boolean => {
        return guard?.role === 'supervisor' || guard?.role === 'admin';
    };

    const isGuard = (): boolean => {
        return guard?.role === 'guard';
    };

    const value = {
        user,
        guard,
        loading: initialLoading || loading,
        signIn,
        signUp,
        signOut,
        hasRole,
        isAdmin,
        isSupervisor,
        isGuard,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};