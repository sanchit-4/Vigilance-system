import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Guard } from '../types/index';

interface AuthContextType {
    user: User | null;
    guard: Guard | null;
    loading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string, guardData: Partial<Guard>) => Promise<any>;
    signOut: () => Promise<void>;
    clearError: () => void;
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
    const [error, setError] = useState<string | null>(null);

    // Timeout utility for async operations
    const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> => {
        return Promise.race([
            promise,
            new Promise<T>((_, reject) => 
                setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
            )
        ]);
    };

    const fetchGuardData = async (userId: string): Promise<Guard | null> => {
        try {
            console.log('Fetching guard data for user:', userId);
            
            const { data, error } = await withTimeout(
                supabase
                    .from('guards')
                    .select('*')
                    .eq('user_id', userId)
                    .single(),
                5000 // 5 second timeout
            );

            if (error) {
                console.error('Error fetching guard data:', error);
                // If no guard found, it's not necessarily an error for new users
                if (error.code === 'PGRST116') {
                    console.log('No guard record found for user');
                    return null;
                }
                throw error;
            }

            console.log('Guard data fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('Failed to fetch guard data:', error);
            setError('Failed to load user profile');
            return null;
        }
    };

    const initializeAuth = async () => {
        try {
            console.log('Initializing auth...');
            setLoading(true);
            setError(null);

            // Get initial session with timeout
            const { data: { session }, error: sessionError } = await withTimeout(
                supabase.auth.getSession(),
                8000 // 8 second timeout
            );

            if (sessionError) {
                console.error('Session error:', sessionError);
                setError('Authentication service unavailable');
                return;
            }

            console.log('Session retrieved:', session ? 'Found' : 'None');
            setUser(session?.user ?? null);
            
            if (session?.user) {
                const guardData = await fetchGuardData(session.user.id);
                setGuard(guardData);
            } else {
                setGuard(null);
            }

        } catch (error) {
            console.error('Auth initialization failed:', error);
            setError('Failed to initialize authentication');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initialize auth on component mount
        initializeAuth();

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session ? 'User present' : 'No user');
                
                try {
                    setUser(session?.user ?? null);
                    
                    if (session?.user) {
                        const guardData = await fetchGuardData(session.user.id);
                        setGuard(guardData);
                    } else {
                        setGuard(null);
                    }
                } catch (error) {
                    console.error('Error in auth state change:', error);
                    setError('Authentication error occurred');
                } finally {
                    // Always ensure loading is false after auth state change
                    setLoading(false);
                }
            }
        );

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Fallback: Force loading to false after maximum wait time
    useEffect(() => {
        const maxLoadingTime = setTimeout(() => {
            if (loading) {
                console.warn('Forcing loading to false after timeout');
                setLoading(false);
                setError('Authentication service is taking too long to respond');
            }
        }, 15000); // 15 second maximum loading time

        return () => clearTimeout(maxLoadingTime);
    }, [loading]);

    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            const result = await withTimeout(
                supabase.auth.signInWithPassword({ email, password }),
                10000
            );
            return result;
        } catch (error) {
            console.error('Sign in error:', error);
            setError('Failed to sign in');
            return { data: null, error };
        }
    };

    const signUp = async (email: string, password: string, guardData: Partial<Guard>) => {
        try {
            setError(null);
            const { data, error } = await withTimeout(
                supabase.auth.signUp({ email, password }),
                10000
            );

            if (data.user && !error) {
                // Create guard record
                try {
                    const { error: guardError } = await withTimeout(
                        supabase
                            .from('guards')
                            .insert([
                                {
                                    ...guardData,
                                    user_id: data.user.id,
                                },
                            ]),
                        10000
                    );

                    if (guardError) {
                        console.error('Error creating guard record:', guardError);
                        return { data, error: guardError };
                    }
                } catch (insertError) {
                    console.error('Failed to create guard record:', insertError);
                    return { data, error: insertError };
                }
            }

            return { data, error };
        } catch (error) {
            console.error('Sign up error:', error);
            setError('Failed to create account');
            return { data: null, error };
        }
    };

    const signOut = async () => {
        try {
            setError(null);
            const { error } = await withTimeout(
                supabase.auth.signOut(),
                5000
            );
            if (error) throw error;
        } catch (error) {
            console.error('Sign out error:', error);
            setError('Failed to sign out');
            throw error;
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        guard,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};