import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://szerfvakezomcyqvxdvf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZXJmdmFrZXpvbWN5cXZ4ZHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDEzMzYsImV4cCI6MjA2NzExNzMzNn0.HOb3ybZG0wCEgCHaekYr7QEdT0CCQUqA4vlgH6aqTHg';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);