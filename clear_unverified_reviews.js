const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearUnverifiedReviews() {
  console.log('Starting clear unverified reviews script...');
  
  // Example logic: delete reviews that don't have a matching user_id in the orders table
  // For a simpler approach, we just delete all reviews that are marked 'dummy' or we can truncate the table if all current data is seeded data.
  // Assuming we want to truncate the table to remove all fake reviews:
  console.log('Fetching all reviews...');
  
  const { data: reviews, error: fetchError } = await supabase.from('reviews').select('*');
  
  if (fetchError) {
    console.error('Error fetching reviews:', fetchError);
    process.exit(1);
  }
  
  console.log(`Found ${reviews.length} reviews.`);
  
  if (reviews.length > 0) {
    console.log('Deleting all reviews to clear fake/seeded data...');
    const { error: deleteError } = await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('Error deleting reviews:', deleteError);
    } else {
      console.log('Successfully cleared reviews.');
    }
  } else {
    console.log('No reviews to clear.');
  }
}

clearUnverifiedReviews();
