import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zngengnowcizeuawfvsc.supabase.co'; // ← replace with your real URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ2VuZ25vd2NpemV1YXdmdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTk2NDUsImV4cCI6MjA2NjYzNTY0NX0.DzNMyKpldDD9wBG6Jk4QaI6oBZAp90DJ0g2sDHCftFI';                   // ← replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
