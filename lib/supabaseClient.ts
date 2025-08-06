import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    global: {
        headers: {
            'x-client-info': 'supabase-js-web',
        },
    },
})

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return supabase.auth.getUser()
}

// Helper function to sign out
export const signOut = async () => {
  return await supabase.auth.signOut()
}

// Test connection function
export const testConnection = async () => {
    try {
        const { data, error } = await supabase.from('guards').select('count').limit(1);
        if (error) {
            console.error('Supabase connection test failed:', error);
            return false;
        }
        console.log('Supabase connection test successful');
        return true;
    } catch (error) {
        console.error('Supabase connection test error:', error);
        return false;
    }
};