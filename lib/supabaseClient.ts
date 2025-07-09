import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Note: These are example credentials that allow the app to run without crashing.
// For a real application, replace these with your actual Supabase project URL and Anon Key,
// preferably from secure environment variables.
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

if (supabaseUrl === 'https://xyzcompany.supabase.co') {
    const warningStyle = 'color: orange; font-size: 14px; font-weight: bold;';
    console.warn('%cWARNING: Supabase is running with example credentials.', warningStyle);
    console.warn('The app will appear to function, but no data will be saved. To connect your own database, replace the placeholder values in `lib/supabaseClient.ts`.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);