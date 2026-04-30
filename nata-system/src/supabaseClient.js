import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jolclylflnqinweixrcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbGNseWxmbG5xaW53ZWl4cmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDM2NjIsImV4cCI6MjA5Mjk3OTY2Mn0.DO8N367F0sj5j-qghlOg90ZYBtFaeGTpHT_iNynwaRg';

export const supabase = createClient(supabaseUrl, supabaseKey);
