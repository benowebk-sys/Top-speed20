// Quick API Test Script
// Run this in browser console: F12 → Console → paste this code

const API_URL = 'http://192.168.1.6:5000/api';

async function testAllEndpoints() {
  console.log('🔍 Testing TOP SPEED API Endpoints...\n');

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Check...');
    const health = await fetch(`${API_URL.replace('/api', '')}/api/health`);
    console.log('✅ Health:', await health.json());
  } catch (e) {
    console.error('❌ Health check failed:', e.message);
  }

  // Test 2: Get Cars
  try {
    console.log('\n2️⃣ Testing Get Cars...');
    const cars = await fetch(`${API_URL}/cars`);
    const carsData = await cars.json();
    console.log(`✅ Cars: Found ${carsData.length || carsData.cars?.length || 0} cars`);
  } catch (e) {
    console.error('❌ Get cars failed:', e.message);
  }

  // Test 3: Login (Invalid)
  try {
    console.log('\n3️⃣ Testing Login (invalid credentials)...');
    const login = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'wrong' })
    });
    const loginData = await login.json();
    console.log('✅ Login response:', loginData);
  } catch (e) {
    console.error('❌ Login failed:', e.message);
  }

  // Test 4: Get Single Car
  try {
    console.log('\n4️⃣ Testing Get Single Car...');
    const car = await fetch(`${API_URL}/cars/default_0`);
    const carData = await car.json();
    console.log('✅ Car:', carData?.brand, carData?.model);
  } catch (e) {
    console.error('❌ Get car failed:', e.message);
  }

  console.log('\n✨ All tests completed!');
}

// Run tests
testAllEndpoints();
