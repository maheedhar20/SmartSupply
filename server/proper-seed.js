const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the actual models
const { User } = require('./src/models/User.js');
const BidRequest = require('./src/models/BidRequest.js').default;
const Bid = require('./src/models/Bid.js').default;

const seedProperData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bidding-system');
    console.log('Connected to MongoDB');

    // Clear existing data
    await BidRequest.deleteMany({});
    await Bid.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create warehouses
    const warehouses = await User.insertMany([
      {
        name: 'Metro Warehouse Solutions',
        email: 'admin@metrowarehouse.com',
        password: hashedPassword,
        role: 'warehouse',
        location: {
          address: '123 Industrial Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400001'
        },
        contactInfo: {
          phone: '+91-9876543210',
          website: 'https://metrowarehouse.com'
        },
        businessType: 'Warehouse'
      },
      {
        name: 'Delhi Distribution Hub',
        email: 'contact@delhihub.com',
        password: hashedPassword,
        role: 'warehouse',
        location: {
          address: '456 Logistics Avenue',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          pincode: '110001'
        },
        contactInfo: {
          phone: '+91-9876543211',
          website: 'https://delhihub.com'
        },
        businessType: 'Distribution'
      }
    ]);

    // Create factories
    const factories = await User.insertMany([
      {
        name: 'Precision Manufacturing Co.',
        email: 'sales@precisionmfg.com',
        password: hashedPassword,
        role: 'factory',
        location: {
          address: '789 Factory Street',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          pincode: '411001'
        },
        contactInfo: {
          phone: '+91-9876543212',
          website: 'https://precisionmfg.com'
        },
        businessType: 'Manufacturing',
        certifications: ['ISO 9001', 'AS9100']
      },
      {
        name: 'Elite Electronics Factory',
        email: 'orders@eliteelectronics.com',
        password: hashedPassword,
        role: 'factory',
        location: {
          address: '321 Tech Park',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          pincode: '560001'
        },
        contactInfo: {
          phone: '+91-9876543213',
          website: 'https://eliteelectronics.com'
        },
        businessType: 'Electronics',
        certifications: ['ISO 9001', 'CE Marking']
      },
      {
        name: 'Quality Textiles Ltd.',
        email: 'production@qualitytextiles.com',
        password: hashedPassword,
        role: 'factory',
        location: {
          address: '654 Textile Mill Road',
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          pincode: '380001'
        },
        contactInfo: {
          phone: '+91-9876543214',
          website: 'https://qualitytextiles.com'
        },
        businessType: 'Textiles',
        certifications: ['GOTS', 'OEKO-TEX']
      }
    ]);

    console.log('Created sample users');

    // Create sample bid requests using the PROPER schema
    const bidRequests = await BidRequest.insertMany([
      {
        warehouseId: warehouses[0]._id,
        productName: 'LED Light Bulbs',
        category: 'Electronics',
        quantity: 10000,
        specifications: {
          description: 'Energy-efficient LED bulbs for commercial use. Must be dimmable and have minimum 3-year warranty.',
          customRequirements: 'Dimmable functionality required',
          qualityStandards: 'ISI standards compliant',
          packagingRequirements: 'Individual packaging with brand labels',
          deliveryLocation: {
            address: '123 Industrial Park',
            city: 'Mumbai',
            state: 'Maharashtra',
            latitude: 19.0760,
            longitude: 72.8777
          }
        },
        budget: {
          minPrice: 80,
          maxPrice: 150,
          preferredPrice: 100
        },
        timeline: {
          requestedDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          urgency: 'medium'
        },
        bidRequirements: {
          minimumFactoryRating: 4,
          preferredMaxDistance: 500,
          requiresCertifications: ['CE Marking', 'BIS'],
          paymentTerms: '30 days'
        },
        status: 'open', // Using the correct status
        biddingDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        notes: 'Standard payment terms: 30 days after delivery'
      },
      {
        warehouseId: warehouses[1]._id,
        productName: 'Cotton T-Shirts',
        category: 'Textiles',
        quantity: 5000,
        specifications: {
          description: '100% cotton round neck t-shirts for retail. Pre-shrunk fabric, colour-fast dyes required.',
          customRequirements: 'Pre-shrunk fabric, colour-fast dyes',
          qualityStandards: 'Export quality standards',
          packagingRequirements: 'Poly bags with size labels',
          deliveryLocation: {
            address: '456 Logistics Avenue',
            city: 'New Delhi',
            state: 'Delhi',
            latitude: 28.7041,
            longitude: 77.1025
          }
        },
        budget: {
          minPrice: 200,
          maxPrice: 350,
          preferredPrice: 280
        },
        timeline: {
          requestedDeliveryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
          urgency: 'low'
        },
        bidRequirements: {
          minimumFactoryRating: 4.2,
          preferredMaxDistance: 1000,
          requiresCertifications: ['GOTS', 'OEKO-TEX'],
          paymentTerms: '45 days'
        },
        status: 'open', // Using the correct status
        biddingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        notes: 'Payment: 50% advance, 50% on delivery'
      }
    ]);

    console.log('Created sample bid requests');

    // Create sample bids
    const bids = await Bid.insertMany([
      {
        bidRequestId: bidRequests[0]._id,
        factoryId: factories[1]._id, // Elite Electronics Factory
        pricing: {
          unitPrice: 95,
          totalPrice: 950000,
          priceBreakdown: {
            materialCost: 60,
            laborCost: 15,
            overheadCost: 10,
            margin: 10
          },
          discountOffered: 0,
          paymentTerms: '30 days'
        },
        delivery: {
          estimatedDeliveryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          deliveryMethod: 'Express Delivery',
          shippingCost: 12000,
          productionTimeInDays: 20
        },
        qualityAssurance: {
          certifications: ['ISO 9001', 'CE Marking'],
          qualityGuarantee: 'LED bulbs with 3-year warranty and ISI compliance',
          warrantyCoverage: '3 years full replacement warranty',
          sampleAvailable: true
        },
        factoryCapacity: {
          currentCapacity: 75,
          maxCapacity: 50000,
          experienceYears: 15,
          similarProjectsCompleted: 200
        },
        proposal: {
          message: 'Elite Electronics Factory offers premium LED bulbs with advanced dimmable technology.',
          valueProposition: 'High-quality, energy-efficient LED bulbs with extended warranty',
          riskMitigation: 'Quality testing at every stage, sample approval before bulk production'
        },
        status: 'submitted',
        competitiveAdvantages: ['Latest LED Technology', 'Fast Delivery', 'Competitive Pricing'],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('Created sample bids');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Created ${warehouses.length} warehouses`);
    console.log(`Created ${factories.length} factories`);
    console.log(`Created ${bidRequests.length} bid requests`);
    console.log(`Created ${bids.length} bids`);

    console.log('\n=== TEST ACCOUNTS ===');
    console.log('Warehouse accounts:');
    console.log('  - admin@metrowarehouse.com (password: password123)');
    console.log('  - contact@delhihub.com (password: password123)');
    console.log('Factory accounts:');
    console.log('  - sales@precisionmfg.com (password: password123)');
    console.log('  - orders@eliteelectronics.com (password: password123)');
    console.log('  - production@qualitytextiles.com (password: password123)');

    console.log('\nBidding system seeded successfully! 🎉');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.disconnect();
  }
};

seedProperData();
