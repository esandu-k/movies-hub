import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yvdfwxzdqfmrwxlmcslc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_y_BjvR4qhvO-4esTCh4YRQ_lzOqagOJ'; 

export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
