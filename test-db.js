import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: users } = await supabase.from('users').select('username').limit(1);
  if (users && users.length > 0) {
    console.log(users[0].username);
  } else {
    console.log('No users found');
  }
}
test();
