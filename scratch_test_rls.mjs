import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRole) {
  console.error("Missing env variables");
  process.exit(1);
}

// 1. Service client to create users directly without email verification
const adminClient = createClient(supabaseUrl, supabaseServiceRole, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// 2. Client for User A (using anon key)
const clientA = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runTest() {
  console.log("--- Starting RLS Test ---");
  
  const emailA = `testA_${Date.now()}@example.com`;
  const emailB = `testB_${Date.now()}@example.com`;
  const password = "password123";

  // Create User A
  const { data: userAData, error: errA } = await adminClient.auth.admin.createUser({
    email: emailA,
    password: password,
    email_confirm: true
  });
  if (errA) throw errA;
  const userA = userAData.user;
  console.log(`Created User A: ${userA.id}`);

  // Create User B
  const { data: userBData, error: errB } = await adminClient.auth.admin.createUser({
    email: emailB,
    password: password,
    email_confirm: true
  });
  if (errB) throw errB;
  const userB = userBData.user;
  console.log(`Created User B: ${userB.id}`);

  // Insert private data for User B (bypassing RLS with admin client)
  console.log("Inserting address for User B...");
  await adminClient.from("addresses").insert({
    profile_id: userB.id,
    street: "User B Secret Street",
    city: "B-City",
    postal_code: "12345",
    country: "Pakistan"
  });

  console.log("Inserting order for User B...");
  await adminClient.from("orders").insert({
    customer_id: userB.id,
    subtotal: 1000,
    total_amount: 1000
  });

  // Log in as User A
  console.log("\nLogging in as User A...");
  const { error: loginError } = await clientA.auth.signInWithPassword({
    email: emailA,
    password: password
  });
  if (loginError) throw loginError;

  // Try to read User B's data using User A's client
  console.log("\nAttempting to read addresses (expecting only User A's data, which is 0 rows)...");
  const { data: addresses, error: addrError } = await clientA.from("addresses").select("*");
  if (addrError) console.error("Error reading addresses:", addrError);
  console.log(`Addresses found: ${addresses.length}`);
  if (addresses.some(a => a.profile_id === userB.id)) {
    console.error("FAIL: User A can see User B's address!");
  } else {
    console.log("PASS: User A cannot see User B's address.");
  }

  console.log("Attempting to read orders...");
  const { data: orders, error: orderError } = await clientA.from("orders").select("*");
  if (orderError) console.error("Error reading orders:", orderError);
  console.log(`Orders found: ${orders.length}`);
  if (orders.some(o => o.customer_id === userB.id)) {
    console.error("FAIL: User A can see User B's order!");
  } else {
    console.log("PASS: User A cannot see User B's order.");
  }

  // Cleanup
  console.log("\nCleaning up test users...");
  await adminClient.auth.admin.deleteUser(userA.id);
  await adminClient.auth.admin.deleteUser(userB.id);
  console.log("--- Test Complete ---");
}

runTest().catch(console.error);
