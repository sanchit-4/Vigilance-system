import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://szerfvakezomcyqvxdvf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZXJmdmFrZXpvbWN5cXZ4ZHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDEzMzYsImV4cCI6MjA2NzExNzMzNn0.HOb3ybZG0wCEgCHaekYr7QEdT0CCQUqA4vlgH6aqTHg'

console.log('Initializing Supabase client...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');

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