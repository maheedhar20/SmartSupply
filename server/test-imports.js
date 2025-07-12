// Test file to check if we can import the models
console.log('Starting import test...');

try {
  console.log('Testing if files exist...');
  const fs = require('fs');
  
  if (fs.existsSync('./src/models/BidRequest.ts')) {
    console.log('BidRequest.ts file exists');
  } else {
    console.log('BidRequest.ts file does NOT exist');
  }
  
  if (fs.existsSync('./src/models/Bid.ts')) {
    console.log('Bid.ts file exists');
  } else {
    console.log('Bid.ts file does NOT exist');
  }
  
  console.log('Test completed');
} catch (error) {
  console.error('Error during test:', error.message);
}
