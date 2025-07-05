const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['warehouse', 'factory'], required: true },
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  phone: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  specifications: {
    weight: Number,
    dimensions: String,
    material: String,
    customFields: mongoose.Schema.Types.Mixed,
  },
  factoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pricePerUnit: { type: Number, required: true },
  minimumOrder: { type: Number, required: true },
  availableQuantity: { type: Number, required: true },
  productionTimeInDays: { type: Number, required: true },
  images: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bidding-system');
    console.log('Connected to MongoDB for demo seeding');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create warehouse users
    const warehouseUsers = [
      {
        email: 'metro@warehouse.com',
        password: await bcrypt.hash('password123', 10),
        role: 'warehouse',
        name: 'Metro Warehouse',
        location: {
          address: '123 Business District, Mumbai, India',
          latitude: 19.0760,
          longitude: 72.8777,
        },
        phone: '+91-98765-43210',
      },
      {
        email: 'global@storage.com',
        password: await bcrypt.hash('password123', 10),
        role: 'warehouse',
        name: 'Global Storage Solutions',
        location: {
          address: '456 Industrial Area, Delhi, India',
          latitude: 28.6139,
          longitude: 77.2090,
        },
        phone: '+91-98765-43211',
      },
    ];

    // Create factory users
    const factoryUsers = [
      {
        email: 'ricemill@factory.com',
        password: await bcrypt.hash('password123', 10),
        role: 'factory',
        name: 'Golden Rice Mills',
        location: {
          address: '789 Agricultural Zone, Punjab, India',
          latitude: 19.0896,
          longitude: 72.8656,
        },
        phone: '+91-98765-43212',
      },
      {
        email: 'snackfactory@food.com',
        password: await bcrypt.hash('password123', 10),
        role: 'factory',
        name: 'Delicious Snacks Factory',
        location: {
          address: '321 Food Park, Gujarat, India',
          latitude: 19.0895,
          longitude: 72.8634,
        },
        phone: '+91-98765-43213',
      },
      {
        email: 'beverages@factory.com',
        password: await bcrypt.hash('password123', 10),
        role: 'factory',
        name: 'Fresh Beverages Co.',
        location: {
          address: '654 Beverage Hub, Karnataka, India',
          latitude: 19.0780,
          longitude: 72.8690,
        },
        phone: '+91-98765-43214',
      },
    ];

    // Insert users
    const allUsers = [...warehouseUsers, ...factoryUsers];
    const insertedUsers = await User.insertMany(allUsers);
    console.log(`Created ${insertedUsers.length} users`);

    // Get factory user IDs
    const factories = insertedUsers.filter(user => user.role === 'factory');

    // Create food products
    const products = [
      // Rice Mill Products
      {
        name: 'Premium Basmati Rice',
        description: 'High-quality long grain basmati rice, perfect for biryanis and pilafs',
        category: 'Rice',
        specifications: {
          weight: 25, // kg per bag
          dimensions: '50cm x 30cm x 15cm',
          material: 'Organic rice',
          customFields: {
            grainLength: 'Extra Long',
            aroma: 'Traditional Basmati',
            variety: 'Pusa Basmati 1121'
          }
        },
        factoryId: factories[0]._id,
        pricePerUnit: 85, // per kg
        minimumOrder: 100, // kg
        availableQuantity: 50000,
        productionTimeInDays: 3,
        isActive: true,
      },
      {
        name: 'Jasmine Rice',
        description: 'Fragrant jasmine rice with excellent texture and taste',
        category: 'Rice',
        specifications: {
          weight: 20,
          dimensions: '45cm x 28cm x 12cm',
          material: 'Premium rice',
          customFields: {
            fragrance: 'High',
            texture: 'Soft and fluffy'
          }
        },
        factoryId: factories[0]._id,
        pricePerUnit: 75,
        minimumOrder: 50,
        availableQuantity: 30000,
        productionTimeInDays: 2,
        isActive: true,
      },
      // Snack Factory Products
      {
        name: 'Cream Biscuits Assorted',
        description: 'Variety pack of cream-filled biscuits in multiple flavors',
        category: 'Biscuits',
        specifications: {
          weight: 5, // kg per carton
          dimensions: '40cm x 30cm x 20cm',
          material: 'Wheat flour, cream, sugar',
          customFields: {
            flavors: ['Vanilla', 'Chocolate', 'Strawberry', 'Orange'],
            shelfLife: '6 months',
            packaging: 'Individual packets'
          }
        },
        factoryId: factories[1]._id,
        pricePerUnit: 45, // per kg
        minimumOrder: 200,
        availableQuantity: 25000,
        productionTimeInDays: 7,
        isActive: true,
      },
      {
        name: 'Digestive Biscuits',
        description: 'Healthy whole wheat digestive biscuits',
        category: 'Biscuits',
        specifications: {
          weight: 4,
          dimensions: '35cm x 25cm x 15cm',
          material: 'Whole wheat flour, oats',
          customFields: {
            type: 'High Fiber',
            sugar: 'Low Sugar',
            shelfLife: '8 months'
          }
        },
        factoryId: factories[1]._id,
        pricePerUnit: 55,
        minimumOrder: 150,
        availableQuantity: 20000,
        productionTimeInDays: 5,
        isActive: true,
      },
      {
        name: 'Potato Chips - Mixed Flavors',
        description: 'Crispy potato chips in various flavors',
        category: 'Snacks',
        specifications: {
          weight: 3,
          dimensions: '30cm x 25cm x 20cm',
          material: 'Potatoes, vegetable oil, seasonings',
          customFields: {
            flavors: ['Classic Salted', 'Masala', 'Tomato', 'Barbecue'],
            style: 'Kettle Cooked'
          }
        },
        factoryId: factories[1]._id,
        pricePerUnit: 120,
        minimumOrder: 100,
        availableQuantity: 15000,
        productionTimeInDays: 4,
        isActive: true,
      },
      // Beverage Factory Products
      {
        name: 'Natural Fruit Juices',
        description: 'Fresh and natural fruit juices without preservatives',
        category: 'Beverages',
        specifications: {
          weight: 12, // liters per carton
          dimensions: '30cm x 20cm x 25cm',
          material: '100% natural fruit juice',
          customFields: {
            flavors: ['Orange', 'Apple', 'Mango', 'Mixed Fruit'],
            preservatives: 'None',
            packaging: '1L Tetra Packs'
          }
        },
        factoryId: factories[2]._id,
        pricePerUnit: 85, // per liter
        minimumOrder: 200,
        availableQuantity: 18000,
        productionTimeInDays: 2,
        isActive: true,
      },
      {
        name: 'Energy Drinks',
        description: 'Refreshing energy drinks with natural ingredients',
        category: 'Beverages',
        specifications: {
          weight: 6, // liters per carton
          dimensions: '25cm x 15cm x 20cm',
          material: 'Water, natural extracts, vitamins',
          customFields: {
            caffeine: 'Natural',
            vitamins: 'B-Complex, C',
            packaging: '250ml Cans'
          }
        },
        factoryId: factories[2]._id,
        pricePerUnit: 95,
        minimumOrder: 300,
        availableQuantity: 22000,
        productionTimeInDays: 3,
        isActive: true,
      },
    ];

    const insertedProducts = await Product.insertMany(products);
    console.log(`Created ${insertedProducts.length} products`);

    console.log('\n=== Demo Seed Data Created Successfully ===\n');

    console.log('Warehouse Users:');
    console.log('- Metro Warehouse (metro@warehouse.com) - Password: password123');
    console.log('- Global Storage Solutions (global@storage.com) - Password: password123\n');

    console.log('Factory Users:');
    console.log('- Golden Rice Mills (ricemill@factory.com) - Password: password123');
    console.log('- Delicious Snacks Factory (snackfactory@food.com) - Password: password123');
    console.log('- Fresh Beverages Co. (beverages@factory.com) - Password: password123\n');

    console.log('Product Categories Available:');
    console.log('- Rice (Premium Basmati, Jasmine)');
    console.log('- Biscuits (Cream Assorted, Digestive)');
    console.log('- Snacks (Potato Chips)');
    console.log('- Beverages (Fruit Juices, Energy Drinks)\n');

    console.log('You can now test the application with these accounts and search for products!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
