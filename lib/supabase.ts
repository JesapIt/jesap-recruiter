import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rseofgxgfawwvxgmtvtz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZW9mZ3hnZmF3d3Z4Z210dnR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQwNjAwOCwiZXhwIjoyMDU1OTgyMDA4fQ.CcFdFlXM0wwJ1k3ozCepOM-Fag19xv-8W57Jx5qfzkk"; // Use a service role key or anon key depending on your needs
export const supabase = createClient(supabaseUrl, supabaseKey);