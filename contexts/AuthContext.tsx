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
        console.error('User ID being searched:', userId);

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
    const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number = 15000): Promise<T> => {
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
        delay: number = 1000
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
                        .single(),
                    10000
                ),
                2
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
            if (error.message) {
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
                    15000
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
                    // Don't set error here, let user continue and create record later
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
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Error details:', error.details);
            
        };
    }, []);
                // Check if there's an admin record without user_id
    useEffect(() => {
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
            const result = await withRetry(
                () => withTimeout(
                    supabase.auth.signInWithPassword({ email, password }),
                    15000
                ),
                2
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
                    15000
                ),
                2
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
                    console.log('Looking for admin record without user_id...');
                    const { data: adminRecord, error: adminError } = await withRetry(
                        () => withTimeout(
                            supabase
                                .from('guards')
                                .select('*')
                                .eq('role', 'admin')
                                .is('user_id', null)
                                .single(),
                            10000
                        ),
                        2
                    );
                    if (guardError) {
                    if (adminError) {
                        console.error('No admin record found without user_id:', adminError);
                        // Create a default guard record if none exists
                        const { data: newGuard, error: createError } = await withRetry(
                            () => withTimeout(
                                supabase
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
                                    .single(),
                                10000
                            ),
                            2
                        );
                        
                        if (createError) {
                            console.error('Error creating default guard record:', createError);
                            return null;
                        }
                        
                        console.log('Created default guard record:', newGuard);
                        return newGuard;
                    } else {
                        console.log('Found admin record without user_id, linking it...');
                        // Link the admin record to this user
                        const { data: linkedAdmin, error: linkError } = await withRetry(
                            () => withTimeout(
                                supabase
                                    .from('guards')
                                    .update({ user_id: userId })
                                    .eq('id', adminRecord.id)
                                    .select()
                                    .single(),
                                10000
                            ),
                            2
                        );
                        
                        if (linkError) {
                            console.error('Error linking admin record:', linkError);
                            return null;
                        }
                        
                        console.log('Successfully linked admin record:', linkedAdmin);
                        return linkedAdmin;
                    }
                    console.error('Failed to create guard record:', insertError);
                    console.error('Failed to handle missing guard record:', createError);
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
                10000
            );
            if (error) throw error;
        } catch (error) {
            console.error('Sign out
} error:', error);
            if (error.message && error.message.includes('timed out')) {
                setError('Connection timeout - please try again');
            } else {
                setError('Failed to sign out');
            }
}d to sign out');
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
}