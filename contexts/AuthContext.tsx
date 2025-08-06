import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Guard } from '../types/index';
// @ts-ignore

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

    // Enhanced timeout utility with retry logic
    const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number = 20000): Promise<T> => {
        return Promise.race([
            promise,
            new Promise<T>((_, reject) => 
                setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
            )
        ]);
    };

    // Retry utility for failed operations
    const withRetry = async <T,>(
        operation: () => Promise<T>,
        maxRetries: number = 3,
        delay: number = 2000
    ): Promise<T> => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                console.log(`Attempt ${attempt} failed:`, error);
                if (attempt === maxRetries) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
        throw new Error('Max retries exceeded');
    };

    const fetchGuardData = async (userId: string): Promise<Guard | null> => {
        try {
            console.log('Fetching guard data for user:', userId);
            
            const { data, error } = await withRetry(
                () => withTimeout(
                    supabase
                        .from('guards')
                        .select('*')
                        .eq('user_id', userId)
                       .maybeSingle()
                        .then(result => result),
                    15000
                ),
                3
            );

            if (error) {
                console.error('Error fetching guard data:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
                console.error('User ID being searched:', userId);
                
                if (error.code === 'PGRST116') {
                    console.log('No guard record found for user');
                    // No guard record found - this is normal for new users
                    // The record will be created during signup or profile setup
                    console.log('No guard record exists for this user yet');
                    return null;
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
            if (error?.message) {
                if (error.message.includes('timed out')) {
                    setError('Connection timeout - please check your internet connection and try again');
                } else if (!error.message.includes('No guard record')) {
                    setError(`Failed to load user profile: ${error.message}`);
                }
            }
            return null;
        }
    };

    const initializeAuth = async () => {
        try {
            console.log('Initializing auth...');
            setLoading(true);
            setError(null);

            const { data: { session }, error: sessionError } = await withRetry(
                () => withTimeout(
                    supabase.auth.getSession(),
                    20000
                ),
                3
            );

            if (sessionError) {
                console.error('Session error:', sessionError);
                setError('Authentication service unavailable - please try again');
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
                    // User can continue without guard record - it will be created during profile setup
                }
            } else {
                setGuard(null);
            }

        } catch (error) {
            console.error('Auth initialization failed:', error);
            if (error.message && error.message.includes('timed out')) {
                setError('Connection timeout - please check your internet connection and try again');
            } else {
                setError('Failed to initialize authentication - please try again');
            }
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
                            // User can continue without guard record
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

    // Force loading to false after maximum time
    useEffect(() => {
        const maxLoadingTime = setTimeout(() => {
            if (loading) {
                console.warn('Forcing loading to false after timeout');
                setLoading(false);
                setError('Authentication service is taking too long to respond');
            }
        }, 25000); // 25 seconds maximum loading time

        return () => clearTimeout(maxLoadingTime);
    }, [loading]);

    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            const result = await withRetry(
                () => withTimeout(
                    supabase.auth.signInWithPassword({ email, password }),
                    20000
                ),
                3
            );
            return result;
        } catch (error) {
            console.error('Sign in error:', error);
            if (error.message && error.message.includes('timed out')) {
                setError('Connection timeout - please check your internet connection and try again');
            } else {
                setError('Failed to sign in - please try again');
            }
            return { data: null, error };
        }
    };

    const signUp = async (email: string, password: string, guardData: Partial<Guard>) => {
        try {
            setError(null);
            console.log('Starting sign up process for:', email);
            
            const { data, error } = await withRetry(
                () => withTimeout(
                    supabase.auth.signUp({ email, password }),
                    20000
                ),
                3
            );

            if (error) {
                console.error('Supabase auth signup error:', error);
                return { data, error };
            }

            if (data.user) {
                console.log('User created successfully:', data.user.id);
                
                // Create user record in users table
                try {
                    const { error: userError } = await withRetry(
                        () => withTimeout(
                            supabase
                                .from('users')
                                .insert([
                                    {
                                        id: data.user.id,
                                        email: data.user.email
                                    }
                                ])
                                .select()
                                .single(),
                            15000
                        ),
                        2
                    );
                    
                    if (userError) {
                        console.error('Failed to create user record:', userError);
                    } else {
                        console.log('User record created successfully');
                    }
                } catch (userRecordError) {
                    console.error('Error creating user record:', userRecordError);
                }
                
                // Create guard record
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
                    // @ts-ignore
                    const { data: newGuardData, error: guardError } = await withRetry(
                        (): Promise<any> => withTimeout(
                            supabase
                                .from('guards')
                                .insert([guardRecord])
                                .select()
                                .single()
                                .then(result => result),
                            15000
                        ),
                        2
                    );
                    
                    if (guardError) {
                        console.error('Failed to create guard record:', guardError);
                        return { data, error: guardError };
                    }
                    
                    console.log('Guard record created successfully:', newGuardData);
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
            console.log('Signing out user...');
            const { error } = await withTimeout(
                supabase.auth.signOut(),
                15000
            );
            if (error) throw error;
        } catch (error) {
            console.error('Sign out error:', error);
            // @ts-ignore
            if (error?.message && error.message.includes('timed out')) {
                setError('Connection timeout - please try again');
            } else {
                setError('Failed to sign out');
            }
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
}