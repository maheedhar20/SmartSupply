import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './src/models/User.js';
import { Product } from './src/models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bidding-system');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create warehouse users
    const warehouseUsers = [
      {
        name: 'Metro Warehouse',
        email: 'metro@warehouse.com',
        password: await bcrypt.hash('password123', 10),
        userType: 'warehouse',
        location: {
          address: '123 Industrial Ave, Los Angeles, CA',
          coordinates: [-118.2437, 34.0522]
        },
        phone: '+1-555-0101'
      },
      {
        name: 'Global Storage Solutions',
        email: 'global@storage.com',
        password: await bcrypt.hash('password123', 10),
        userType: 'warehouse',
        location: {
          address: '456 Commerce St, New York, NY',
          coordinates: [-74.0060, 40.7128]
        },
        phone: '+1-555-0102'
      }
    ];

    // Create factory users
    const factoryUsers = [
      {
        name: 'TechParts Manufacturing',
        email: 'techparts@factory.com',
        password: await bcrypt.hash('password123', 10),
        userType: 'factory',
        location: {
          address: '789 Factory Rd, San Francisco, CA',
          coordinates: [-122.4194, 37.7749]
        },
        phone: '+1-555-0201',
        specialties: ['Electronics', 'Computer Parts'],
        verified: true
      },
      {
        name: 'AutoParts Plus',
        email: 'autoparts@factory.com',
        password: await bcrypt.hash('password123', 10),
        userType: 'factory',
        location: {
          address: '321 Manufacturing Blvd, Detroit, MI',
          coordinates: [-83.0458, 42.3314]
        },
        phone: '+1-555-0202',
        specialties: ['Automotive', 'Machinery'],
        verified: true
      },
      {
        name: 'GreenTech Industries',
        email: 'greentech@factory.com',
        password: await bcrypt.hash('password123', 10),
        userType: 'factory',
        location: {
          address: '654 Eco Drive, Seattle, WA',
          coordinates: [-122.3321, 47.6062]
        },
        phone: '+1-555-0203',
        specialties: ['Renewable Energy', 'Solar Panels'],
        verified: true
      }
    ];

    // Insert users
    const allUsers = [...warehouseUsers, ...factoryUsers];
    const insertedUsers = await User.insertMany(allUsers);
    console.log(`Created ${insertedUsers.length} users`);

    // Get factory IDs for products
    const factories = insertedUsers.filter(user => user.userType === 'factory');

    // Create products
    const products = [
      // TechParts Manufacturing products
      {
        name: 'High-Performance CPU',
        description: 'Latest generation processor with 8 cores and 16 threads',
        category: 'Electronics',
        pricePerUnit: 299.99,
        minimumQuantity: 10,
        availableQuantity: 500,
        factoryId: factories[0]._id,
        specifications: {
          brand: 'TechParts',
          model: 'TP-8000',
          warranty: '2 years'
        },
        images: ['cpu1.jpg', 'cpu2.jpg'],
        isActive: true
      },
      {
        name: 'Gaming Graphics Card',
        description: 'Professional-grade graphics card for gaming and rendering',
        category: 'Electronics',
        pricePerUnit: 599.99,
        minimumQuantity: 5,
        availableQuantity: 150,
        factoryId: factories[0]._id,
        specifications: {
          brand: 'TechParts',
          model: 'TP-GPU-Pro',
          memory: '16GB GDDR6'
        },
        images: ['gpu1.jpg'],
        isActive: true
      },
      {
        name: 'Server Motherboard',
        description: 'Enterprise-grade motherboard for server applications',
        category: 'Electronics',
        pricePerUnit: 450.00,
        minimumQuantity: 20,
        availableQuantity: 200,
        factoryId: factories[0]._id,
        specifications: {
          brand: 'TechParts',
          model: 'TP-Server-MB',
          sockets: 'Dual CPU'
        },
        images: ['motherboard1.jpg'],
        isActive: true
      },

      // AutoParts Plus products
      {
        name: 'Brake Disc Set',
        description: 'High-quality brake discs for passenger vehicles',
        category: 'Automotive',
        pricePerUnit: 89.99,
        minimumQuantity: 50,
        availableQuantity: 1000,
        factoryId: factories[1]._id,
        specifications: {
          brand: 'AutoParts Plus',
          material: 'Cast Iron',
          compatibility: 'Universal'
        },
        images: ['brake-disc1.jpg'],
        isActive: true
      },
      {
        name: 'LED Headlight Assembly',
        description: 'Modern LED headlight with adaptive lighting technology',
        category: 'Automotive',
        pricePerUnit: 245.00,
        minimumQuantity: 25,
        availableQuantity: 300,
        factoryId: factories[1]._id,
        specifications: {
          brand: 'AutoParts Plus',
          type: 'LED',
          voltage: '12V'
        },
        images: ['headlight1.jpg'],
        isActive: true
      },
      {
        name: 'Transmission Gear',
        description: 'Precision-engineered transmission gear for heavy machinery',
        category: 'Machinery',
        pricePerUnit: 1250.00,
        minimumQuantity: 5,
        availableQuantity: 50,
        factoryId: factories[1]._id,
        specifications: {
          brand: 'AutoParts Plus',
          material: 'Hardened Steel',
          load_capacity: '50 tons'
        },
        images: ['gear1.jpg'],
        isActive: true
      },

      // GreenTech Industries products
      {
        name: 'Solar Panel 400W',
        description: 'High-efficiency monocrystalline solar panel',
        category: 'Renewable Energy',
        pricePerUnit: 180.00,
        minimumQuantity: 100,
        availableQuantity: 2000,
        factoryId: factories[2]._id,
        specifications: {
          brand: 'GreenTech',
          power: '400W',
          efficiency: '22.1%'
        },
        images: ['solar-panel1.jpg'],
        isActive: true
      },
      {
        name: 'Wind Turbine Generator',
        description: 'Compact wind generator for residential use',
        category: 'Renewable Energy',
        pricePerUnit: 2500.00,
        minimumQuantity: 2,
        availableQuantity: 25,
        factoryId: factories[2]._id,
        specifications: {
          brand: 'GreenTech',
          capacity: '5kW',
          wind_speed: '3-25 m/s'
        },
        images: ['wind-turbine1.jpg'],
        isActive: true
      },
      {
        name: 'Battery Storage System',
        description: 'Lithium-ion battery system for energy storage',
        category: 'Renewable Energy',
        pricePerUnit: 3200.00,
        minimumQuantity: 1,
        availableQuantity: 40,
        factoryId: factories[2]._id,
        specifications: {
          brand: 'GreenTech',
          capacity: '10kWh',
          cycles: '6000+'
        },
        images: ['battery1.jpg'],
        isActive: true
      }
    ];

    const insertedProducts = await Product.insertMany(products);
    console.log(`Created ${insertedProducts.length} products`);

    console.log('\n=== Seed Data Created Successfully ===');
    console.log('\nWarehouse Users:');
    warehouseUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Password: password123`);
    });

    console.log('\nFactory Users:');
    factoryUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Password: password123`);
    });

    console.log('\nYou can now test the application with these accounts!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
