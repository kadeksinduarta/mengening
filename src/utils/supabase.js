import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://juovlyacsmcnaacjcnai.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1b3ZseWFjc21jbmFhY2pjbmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NTUxNjIsImV4cCI6MjA5NzUzMTE2Mn0.Sr85UiRl5XQNQaWL7x2-dBJhd-8ZatAHg2MfueYj5wg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Assuming the bucket name is 'images' based on standard conventions
    const { data } = supabase.storage.from('images').getPublicUrl(imagePath);
    return data.publicUrl;
};
