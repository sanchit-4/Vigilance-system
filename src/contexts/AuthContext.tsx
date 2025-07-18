@@ .. @@
 import { supabase } from '../lib/supabaseClient';
 import { User, AuthError } from '@supabase/supabase-js';
 import { Database } from '../types/supabase';
-import { getErrorMessage } from '../lib/utils';
 
 type Guard = Database['public']['Tables']['guards']['Row'];