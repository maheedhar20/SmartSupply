const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./src/models/User.js').User;
const BidRequest = require('./src/models/BidRequest.js').default;
const Bid = require('./src/models/Bid.js').default;

require('dotenv').config();

const seedBiddingData = async () => {
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
          alternatePhone: '+91-9876543211',
          website: 'https://metrowarehouse.com'
        }
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
          phone: '+91-9876543212',
          alternatePhone: '+91-9876543213',
          website: 'https://delhihub.com'
        }
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
          phone: '+91-9876543214',
          alternatePhone: '+91-9876543215',
          website: 'https://precisionmfg.com'
        },
        businessType: 'Manufacturing',
        certifications: ['ISO 9001', 'ISO 14001']
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
          phone: '+91-9876543216',
          alternatePhone: '+91-9876543217',
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
          phone: '+91-9876543218',
          alternatePhone: '+91-9876543219',
          website: 'https://qualitytextiles.com'
        },
        businessType: 'Textiles',
        certifications: ['GOTS', 'OEKO-TEX']
      }
    ]);

    console.log('Created sample users');

    // Create sample bid requests
    const bidRequests = await BidRequest.insertMany([
      {
        warehouseId: warehouses[0]._id,
        title: 'LED Light Bulbs - Bulk Order',
        productSpecs: {
          name: 'LED Light Bulbs',
          category: 'Electronics',
          description: 'Energy-efficient LED bulbs for commercial use',
          specifications: {
            wattage: '9W',
            lumens: '800lm',
            colorTemperature: '4000K',
            baseType: 'E27'
          },
          customRequirements: 'Must be dimmable and have minimum 3-year warranty'
        },
        quantity: 10000,
        budget: {
          minPrice: 80,
          maxPrice: 150,
          currency: 'INR'
        },
        timeline: {
          biddingDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          requestedDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          urgency: 'medium'
        },
        qualityRequirements: {
          minimumRating: 4.0,
          certifications: ['CE Marking', 'BIS'],
          qualityStandards: 'ISI standards compliant'
        },
        deliveryLocation: {
          address: '123 Industrial Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        status: 'active',
        termsAndConditions: 'Standard payment terms: 30 days after delivery'
      },
      {
        warehouseId: warehouses[1]._id,
        title: 'Cotton T-Shirts - Wholesale Order',
        productSpecs: {
          name: 'Cotton T-Shirts',
          category: 'Apparel',
          description: '100% cotton round neck t-shirts for retail',
          specifications: {
            material: '100% Cotton',
            gsm: '180 GSM',
            colors: 'White, Black, Navy Blue',
            sizes: 'S, M, L, XL, XXL'
          },
          customRequirements: 'Pre-shrunk fabric, colour-fast dyes'
        },
        quantity: 5000,
        budget: {
          minPrice: 200,
          maxPrice: 350,
          currency: 'INR'
        },
        timeline: {
          biddingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          requestedDeliveryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
          urgency: 'low'
        },
        qualityRequirements: {
          minimumRating: 4.2,
          certifications: ['GOTS', 'OEKO-TEX'],
          qualityStandards: 'Export quality standards'
        },
        deliveryLocation: {
          address: '456 Logistics Avenue',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        status: 'active',
        termsAndConditions: 'Payment: 50% advance, 50% on delivery'
      },
      {
        warehouseId: warehouses[0]._id,
        title: 'Precision Metal Components',
        productSpecs: {
          name: 'Aluminum Brackets',
          category: 'Manufacturing',
          description: 'CNC machined aluminum brackets for industrial equipment',
          specifications: {
            material: 'Aluminum 6061-T6',
            dimensions: '100mm x 50mm x 10mm',
            tolerance: '±0.1mm',
            finish: 'Anodized'
          },
          customRequirements: 'Must pass stress testing and dimensional verification'
        },
        quantity: 2500,
        budget: {
          minPrice: 450,
          maxPrice: 650,
          currency: 'INR'
        },
        timeline: {
          biddingDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          requestedDeliveryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
          urgency: 'high'
        },
        qualityRequirements: {
          minimumRating: 4.5,
          certifications: ['ISO 9001'],
          qualityStandards: 'AS9100 aerospace standards preferred'
        },
        deliveryLocation: {
          address: '123 Industrial Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        status: 'active',
        termsAndConditions: 'Net 15 payment terms, quality inspection required'
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
          total: 950000,
          breakdown: {
            materials: 60,
            labor: 15,
            overhead: 10,
            profit: 10
          },
          currency: 'INR',
          paymentTerms: '30 days'
        },
        delivery: {
          estimatedDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          method: 'Road Transport',
          cost: 5000,
          productionTime: 20
        },
        qualityAssurance: {
          certifications: ['CE Marking', 'BIS'],
          standards: 'ISI compliant, 3-year warranty',
          testing: 'Pre-delivery quality testing included'
        },
        proposal: {
          message: 'We are a leading electronics manufacturer with 15+ years of experience in LED lighting solutions.',
          valueProposition: 'High-quality LED bulbs with extended warranty and energy efficiency certification',
          timeline: 'Can deliver within 25 days with flexible batch deliveries'
        },
        factoryCapacity: {
          currentUtilization: 75,
          monthlyCapacity: 50000,
          experienceYears: 15
        },
        status: 'pending',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        bidRequestId: bidRequests[1]._id,
        factoryId: factories[2]._id, // Quality Textiles Ltd.
        pricing: {
          unitPrice: 280,
          total: 1400000,
          breakdown: {
            materials: 180,
            labor: 50,
            overhead: 30,
            profit: 20
          },
          currency: 'INR',
          paymentTerms: '50% advance, 50% on delivery'
        },
        delivery: {
          estimatedDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
          method: 'Road Transport',
          cost: 8000,
          productionTime: 35
        },
        qualityAssurance: {
          certifications: ['GOTS', 'OEKO-TEX'],
          standards: 'Export quality, pre-shrunk, colorfast',
          testing: 'Fabric testing and color fastness certification'
        },
        proposal: {
          message: 'Quality Textiles Ltd. specializes in premium cotton garments with international quality standards.',
          valueProposition: 'Sustainable textile production with GOTS certification and ethical manufacturing',
          timeline: 'Flexible delivery schedule with quality assurance at every step'
        },
        factoryCapacity: {
          currentUtilization: 60,
          monthlyCapacity: 25000,
          experienceYears: 12
        },
        status: 'pending',
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      },
      {
        bidRequestId: bidRequests[2]._id,
        factoryId: factories[0]._id, // Precision Manufacturing Co.
        pricing: {
          unitPrice: 520,
          total: 1300000,
          breakdown: {
            materials: 300,
            labor: 120,
            overhead: 60,
            profit: 40
          },
          currency: 'INR',
          paymentTerms: 'Net 15'
        },
        delivery: {
          estimatedDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
          method: 'Express Delivery',
          cost: 12000,
          productionTime: 15
        },
        qualityAssurance: {
          certifications: ['ISO 9001', 'AS9100'],
          standards: 'Aerospace grade precision machining',
          testing: 'CMM dimensional verification and stress testing'
        },
        proposal: {
          message: 'Precision Manufacturing Co. offers aerospace-grade CNC machining with strict quality controls.',
          valueProposition: 'Unmatched precision and quality with AS9100 certification for critical applications',
          timeline: 'Fast turnaround with rigorous quality inspection at each stage'
        },
        factoryCapacity: {
          currentUtilization: 80,
          monthlyCapacity: 10000,
          experienceYears: 20
        },
        status: 'pending',
        validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
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
    warehouses.forEach(w => console.log(`  - ${w.email} (password: password123)`));
    console.log('Factory accounts:');
    factories.forEach(f => console.log(`  - ${f.email} (password: password123)`));

    console.log('\nBidding system seeded successfully! 🎉');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedBiddingData();
