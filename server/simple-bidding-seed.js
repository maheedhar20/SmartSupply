const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Simple user schema for seeding
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['warehouse', 'factory'], required: true },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  contactInfo: {
    phone: String,
    alternatePhone: String,
    website: String
  },
  businessType: String,
  certifications: [String]
}, { timestamps: true });

const bidRequestSchema = new mongoose.Schema({
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  productSpecs: {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    specifications: mongoose.Schema.Types.Mixed,
    customRequirements: String
  },
  quantity: { type: Number, required: true },
  budget: {
    minPrice: Number,
    maxPrice: Number,
    currency: { type: String, default: 'INR' }
  },
  timeline: {
    biddingDeadline: Date,
    requestedDeliveryDate: Date,
    urgency: { type: String, enum: ['low', 'medium', 'high', 'urgent'] }
  },
  qualityRequirements: {
    minimumRating: Number,
    certifications: [String],
    qualityStandards: String
  },
  deliveryLocation: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  status: { type: String, enum: ['open', 'closed', 'awarded', 'cancelled'], default: 'open' },
  termsAndConditions: String
}, { timestamps: true });

const bidSchema = new mongoose.Schema({
  bidRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BidRequest', required: true },
  factoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pricing: {
    unitPrice: Number,
    total: Number,
    breakdown: {
      materials: Number,
      labor: Number,
      overhead: Number,
      profit: Number
    },
    currency: { type: String, default: 'INR' },
    paymentTerms: String
  },
  delivery: {
    estimatedDate: Date,
    method: String,
    cost: Number,
    productionTime: Number
  },
  qualityAssurance: {
    certifications: [String],
    standards: String,
    testing: String
  },
  proposal: {
    message: String,
    valueProposition: String,
    timeline: String
  },
  factoryCapacity: {
    currentUtilization: Number,
    monthlyCapacity: Number,
    experienceYears: Number
  },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  validUntil: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const BidRequest = mongoose.model('BidRequest', bidRequestSchema);
const Bid = mongoose.model('Bid', bidSchema);

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
          biddingDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          requestedDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
        status: 'open',
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
          biddingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          requestedDeliveryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
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
        status: 'open',
        termsAndConditions: 'Payment: 50% advance, 50% on delivery'
      }
    ]);

    console.log('Created sample bid requests');

    // Create sample bids
    const bids = await Bid.insertMany([
      {
        bidRequestId: bidRequests[0]._id,
        factoryId: factories[1]._id,
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
          message: 'We are a leading electronics manufacturer with 15+ years of experience.',
          valueProposition: 'High-quality LED bulbs with extended warranty',
          timeline: 'Can deliver within 25 days with flexible batch deliveries'
        },
        factoryCapacity: {
          currentUtilization: 75,
          monthlyCapacity: 50000,
          experienceYears: 15
        },
        status: 'pending',
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
    warehouses.forEach(w => console.log(`  - ${w.email} (password: password123)`));
    console.log('Factory accounts:');
    factories.forEach(f => console.log(`  - ${f.email} (password: password123)`));

    console.log('\nBidding system seeded successfully! 🎉');
    
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedBiddingData();
