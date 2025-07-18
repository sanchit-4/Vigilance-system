import { createClient } from '@supabase/supabase-js'

// These would normally come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return supabase.auth.getUser()
}

// Helper function to sign out
export const signOut = async () => {
  return await supabase.auth.signOut()
}