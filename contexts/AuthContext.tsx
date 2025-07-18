import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Guard } from '../types/index';

interface AuthContextType {
    user: User | null;
    guard: Guard | null;
    loading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
    signUp: (email: string, password: string, guardData: Partial<Guard>) => Promise<{ data: any; error: any }>;
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
                8000
            );

            if (error) {
                console.error('Error fetching guard data:', error);
                if (error.code === 'PGRST116') {
                    console.log('No guard record found for user');
                    // Create a default guard record if none exists
                    try {
                        const { data: newGuard, error: createError } = await supabase
                            .from('guards')
                            .insert([
                                {
                                    user_id: userId,
                                    name: 'New User',
                                    role: 'guard',
                                    base_salary: 3000,
                                    category: 'Guard',
                                    date_of_joining: new Date().toISOString().split('T')[0],
                                    is_active: true,
                                    police_verification_status: 'Pending'
                                }
                            ])
                            .select()
                            .single();
                        
                        if (createError) {
                            console.error('Error creating default guard record:', createError);
                            return null;
                        }
                        
                        console.log('Created default guard record:', newGuard);
                        return newGuard;
                    } catch (createError) {
                        console.error('Failed to create default guard record:', createError);
                        return null;
                    }
                }
                
                // Don't throw error for permission issues, just return null
                if (error.code === 'PGRST301' || error.code === 'PGRST204') {
                    console.log('Permission denied or no data - user may not have guard record yet');
                    return null;
                }
                
                throw error;
            }

            console.log('Guard data fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('Failed to fetch guard data:', error);
            // Only set error for actual failures, not missing records
            if (error.message && !error.message.includes('No guard record')) {
                setError(`Failed to load user profile: ${error.message}`);
            }
            return null;
        }
    };

    const initializeAuth = async () => {
        try {
            console.log('Initializing auth...');
            setLoading(true);
            setError(null);

            const { data: { session }, error: sessionError } = await withTimeout(
                supabase.auth.getSession(),
                8000
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
                
                // If no guard data but user exists, allow them to continue
                if (!guardData) {
                    console.log('User authenticated but no guard record found');
                    // Don't set error here, let user continue and create record later
                }
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
        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session ? 'User present' : 'No user');
                
                try {
                    setUser(session?.user ?? null);
                    
                    if (session?.user) {
                        const guardData = await fetchGuardData(session.user.id);
                        setGuard(guardData);
                        
                        // If no guard data but user exists, allow them to continue
                        if (!guardData) {
                            console.log('User authenticated but no guard record found in state change');
                        }
                    } else {
                        setGuard(null);
                    }
                } catch (error) {
                    console.error('Error in auth state change:', error);
                    setError('Authentication error occurred');
                } finally {
                    setLoading(false);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const maxLoadingTime = setTimeout(() => {
            if (loading) {
                console.warn('Forcing loading to false after timeout');
                setLoading(false);
                setError('Authentication service is taking too long to respond');
            }
        }, 15000);

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
            console.log('Starting sign up process for:', email);
            
            const { data, error } = await withTimeout(
                supabase.auth.signUp({ email, password }),
                10000
            );

            if (error) {
                console.error('Supabase auth signup error:', error);
                return { data, error };
            }

            if (data.user) {
                console.log('User created successfully:', data.user.id);
                
                // Add a small delay to ensure user is fully created
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                try {
                    const guardRecord = {
                        ...guardData,
                        user_id: data.user.id,
                        name: guardData.name || 'New User',
                        role: guardData.role || 'guard',
                        base_salary: guardData.base_salary || 3000,
                        category: guardData.category || 'Guard',
                        date_of_joining: guardData.date_of_joining || new Date().toISOString().split('T')[0],
                        is_active: guardData.is_active ?? true,
                        police_verification_status: guardData.police_verification_status || 'Pending'
                    };
                    
                    console.log('Creating guard record:', guardRecord);
                    
                    const { data: guardData2, error: guardError } = await withTimeout(
                        supabase
                            .from('guards')
                            .insert([guardRecord])
                            .select()
                            .single(),
                        10000
                    );

                    if (guardError) {
                        console.error('Error creating guard record:', guardError);
                        setError(`Failed to create user profile: ${guardError.message}`);
                        return { data, error: guardError };
                    }
                    
                    console.log('Guard record created successfully:', guardData2);
                } catch (insertError) {
                    console.error('Failed to create guard record:', insertError);
                    setError(`Failed to create user profile: ${insertError.message}`);
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
            console.log('Signing out user...');
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
        console.log('Error cleared');
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
}
}
}