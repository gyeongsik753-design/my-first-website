import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dqbfaauvtiunkgunivrf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYmZhYXV2dGl1bmtndW5pdnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTgyOTIsImV4cCI6MjA5NzY5NDI5Mn0._-xN_GNLF2_C4o9SgdYuNLP0kKrBRjorVct5GU00ubc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
