import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Guard } from '../types/index';

interface AuthContextType {
    user: User | null;
    guard: Guard | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string, guardData: Partial<Guard>) => Promise<any>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [guard, setGuard] = useState<Guard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            
            if (session?.user) {
                await fetchGuardData(session.user.id);
            }
            setLoading(false);
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                
                if (session?.user) {
                    await fetchGuardData(session.user.id);
                } else {
                    setGuard(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchGuardData = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('guards')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            setGuard(data);
        } catch (error) {
            console.error('Error fetching guard data:', error);
            setGuard(null);
        }
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signUp = async (email: string, password: string, guardData: Partial<Guard>) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (data.user && !error) {
            // Create guard record
            const { error: guardError } = await supabase
                .from('guards')
                .insert([
                    {
                        ...guardData,
                        user_id: data.user.id,
                    },
                ]);

            if (guardError) {
                console.error('Error creating guard record:', guardError);
                return { data, error: guardError };
            }
        }

        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const value = {
        user,
        guard,
        loading,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};