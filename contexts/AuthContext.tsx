@@ .. @@
 import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
-import { supabase } from '../lib/supabaseClient';
+import { supabase } from './lib/supabaseClient';
 import { User, AuthError } from '@supabase/supabase-js';
-import { Database } from '../types/supabase';
+import { Database } from './types/supabase';