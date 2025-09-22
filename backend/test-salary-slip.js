// Test script for Salary Slip API endpoints
// Run this after starting your backend server

const API_BASE_URL = 'http://localhost:8000/api/salary-slip';

// Test function to make API calls
async function testSalarySlipAPI() {
  console.log('🧪 Testing Salary Slip API Endpoints\n');

  try {
    // Test 1: Get available employees
    console.log('1️⃣ Testing GET /api/salary-slip/employees');
    const employeesResponse = await fetch(`${API_BASE_URL}/employees`);
    const employees = await employeesResponse.json();
    console.log('Available employees:', employees);
    console.log('✅ Success\n');

    // Test 2: Generate salary slip for EMP001
    console.log('2️⃣ Testing GET /api/salary-slip/EMP001?month=2025-08');
    const slipResponse = await fetch(`${API_BASE_URL}/EMP001?month=2025-08`);
    const salarySlip = await slipResponse.json();
    console.log('Generated salary slip:', JSON.stringify(salarySlip, null, 2));
    console.log('✅ Success\n');

    // Test 3: Generate salary slip for EMP002
    console.log('3️⃣ Testing GET /api/salary-slip/EMP002?month=2025-08');
    const slipResponse2 = await fetch(`${API_BASE_URL}/EMP002?month=2025-08`);
    const salarySlip2 = await slipResponse2.json();
    console.log('Generated salary slip for EMP002:', JSON.stringify(salarySlip2, null, 2));
    console.log('✅ Success\n');

    // Test 4: Get all salary slips
    console.log('4️⃣ Testing GET /api/salary-slip');
    const allSlipsResponse = await fetch(`${API_BASE_URL}`);
    const allSlips = await allSlipsResponse.json();
    console.log('All salary slips:', allSlips.length, 'records found');
    console.log('✅ Success\n');

    // Test 5: Get salary slip by ID (using the first slip's ID)
    if (allSlips.length > 0) {
      console.log('5️⃣ Testing GET /api/salary-slip/id/{id}');
      const slipByIdResponse = await fetch(`${API_BASE_URL}/id/${allSlips[0].id}`);
      const slipById = await slipByIdResponse.json();
      console.log('Salary slip by ID:', JSON.stringify(slipById, null, 2));
      console.log('✅ Success\n');
    }

    // Test 6: Update payment status
    if (allSlips.length > 0) {
      console.log('6️⃣ Testing PUT /api/salary-slip/{id}/status');
      const updateResponse = await fetch(`${API_BASE_URL}/${allSlips[0].id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: 'Paid' })
      });
      const updatedSlip = await updateResponse.json();
      console.log('Updated salary slip:', JSON.stringify(updatedSlip, null, 2));
      console.log('✅ Success\n');
    }

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testSalarySlipAPI();
