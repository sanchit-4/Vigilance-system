import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return supabase.auth.getUser()
}

// Helper function to sign out
export const signOut = async () => {
  return await supabase.auth.signOut()
}