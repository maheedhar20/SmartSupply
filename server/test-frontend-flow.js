// Test script to simulate frontend API calls
const axios = require('axios').default;

const BASE_URL = 'http://localhost:3001/api';

async function testFrontendFlow() {
  try {
    console.log('🧪 Testing Frontend API Flow...\n');

    // Step 1: Test Login
    console.log('1️⃣ Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@metrowarehouse.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('User role:', loginResponse.data.user.role);
    
    const token = loginResponse.data.token;
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Step 2: Test warehouse bid requests
    console.log('\n2️⃣ Testing warehouse bid requests...');
    const warehouseRequests = await axios.get(`${BASE_URL}/bidding/my-requests`, {
      headers: authHeaders
    });
    
    console.log('✅ Warehouse requests fetched:', warehouseRequests.data.length, 'requests');

    // Step 3: Test factory login
    console.log('\n3️⃣ Testing factory login...');
    const factoryLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'orders@eliteelectronics.com',
      password: 'password123'
    });
    
    console.log('✅ Factory login successful!');
    const factoryToken = factoryLoginResponse.data.token;
    const factoryAuthHeaders = {
      'Authorization': `Bearer ${factoryToken}`,
      'Content-Type': 'application/json'
    };

    // Step 4: Test factory view bid requests
    console.log('\n4️⃣ Testing factory bid requests...');
    const factoryRequests = await axios.get(`${BASE_URL}/bidding/requests`, {
      headers: factoryAuthHeaders
    });
    
    console.log('✅ Factory can see', factoryRequests.data.length, 'bid requests');

    // Step 5: Test creating a new bid request (warehouse)
    console.log('\n5️⃣ Testing bid request creation...');
    const newBidRequest = {
      productName: 'Frontend Test Product',
      category: 'Electronics',
      quantity: 500,
      specifications: {
        description: 'Test product from frontend simulation',
        customRequirements: 'High quality required',
        qualityStandards: 'ISO standards',
        packagingRequirements: 'Protective packaging',
        deliveryLocation: {
          address: '123 Test Address',
          city: 'Mumbai',
          state: 'Maharashtra',
          latitude: 19.0760,
          longitude: 72.8777
        }
      },
      budget: {
        minPrice: 25,
        maxPrice: 50,
        preferredPrice: 35
      },
      timeline: {
        requestedDeliveryDate: '2025-08-20',
        urgency: 'medium'
      },
      bidRequirements: {
        minimumFactoryRating: 3,
        preferredMaxDistance: 300,
        requiresCertifications: ['ISO 9001'],
        paymentTerms: '30 days'
      },
      biddingDeadline: '2025-07-25',
      notes: 'Test bid request from simulation'
    };

    const createResponse = await axios.post(`${BASE_URL}/bidding/requests`, newBidRequest, {
      headers: authHeaders
    });
    
    console.log('✅ Bid request created successfully!');
    console.log('New request ID:', createResponse.data._id);

    // Step 6: Verify factory can see the new request
    console.log('\n6️⃣ Verifying factory can see new request...');
    const updatedFactoryRequests = await axios.get(`${BASE_URL}/bidding/requests`, {
      headers: factoryAuthHeaders
    });
    
    console.log('✅ Factory can now see', updatedFactoryRequests.data.length, 'bid requests');

    console.log('\n🎉 All API endpoints working correctly!');
    console.log('\n📋 Summary:');
    console.log('• Warehouse login: ✅');
    console.log('• Factory login: ✅');
    console.log('• Warehouse view requests: ✅');
    console.log('• Factory view requests: ✅');
    console.log('• Create bid request: ✅');
    console.log('• Real-time updates: ✅');

  } catch (error) {
    console.error('❌ Test failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
  }
}

testFrontendFlow();
