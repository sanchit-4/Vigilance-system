import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://szerfvakezomcyqvxdvf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZXJmdmFrZXpvbWN5cXZ4ZHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDEzMzYsImV4cCI6MjA2NzExNzMzNn0.HOb3ybZG0wCEgCHaekYr7QEdT0CCQUqA4vlgH6aqTHg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return supabase.auth.getUser()
}

// Helper function to sign out
export const signOut = async () => {
  return await supabase.auth.signOut()
}