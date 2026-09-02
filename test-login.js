// Quick test script to verify login API
async function testLogin() {
  console.log('🧪 Testing login API...\n');

  const credentials = {
    email: 'admin@smk3.local',
    password: 'admin123'
  };

  try {
    console.log('📡 Sending POST request to http://localhost:3001/api/auth/login');
    console.log('📦 Credentials:', credentials);
    console.log('');

    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('📨 Response status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login SUCCESS!');
      console.log('👤 User:', data.user);
      console.log('🔑 Token:', data.token.substring(0, 20) + '...');
    } else {
      const error = await response.json();
      console.log('❌ Login FAILED!');
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('❌ Connection FAILED!');
    console.log('Error:', error.message);
    console.log('');
    console.log('💡 Make sure:');
    console.log('   1. Backend is running (bun run start:dev)');
    console.log('   2. PostgreSQL is running (docker-compose up -d)');
    console.log('   3. Users are seeded (bun run seed)');
  }
}

testLogin();
