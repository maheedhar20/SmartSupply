const mongoose = require('mongoose');
require('dotenv').config();

// Define order schema
const orderSchema = new mongoose.Schema({
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  factoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'in_production', 'completed', 'cancelled'],
    default: 'pending' 
  },
  requestedDeliveryDate: Date,
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  notes: String,
  factoryResponse: {
    message: String,
    counterOffer: {
      price: Number,
      deliveryDate: Date,
    },
    respondedAt: Date,
  },
}, { timestamps: true });

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

const Order = mongoose.model('Order', orderSchema);
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

async function createSampleOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bidding-system');
    console.log('Connected to MongoDB for adding sample orders');

    // Get existing users and products
    const warehouses = await User.find({ role: 'warehouse' });
    const factories = await User.find({ role: 'factory' });
    const products = await Product.find({});

    if (warehouses.length === 0 || factories.length === 0 || products.length === 0) {
      console.log('Please run the demo-seed.js first to create users and products');
      return;
    }

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Create sample orders with different statuses
    const orders = [
      {
        warehouseId: warehouses[0]._id,
        factoryId: factories[0]._id,
        productId: products[0]._id,
        quantity: 500,
        unitPrice: products[0].pricePerUnit,
        totalPrice: 500 * products[0].pricePerUnit,
        status: 'completed',
        requestedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        actualDeliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: 'Urgent delivery required for festival season',
        factoryResponse: {
          message: 'Order accepted. We can deliver 2 days earlier than requested.',
          respondedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        }
      },
      {
        warehouseId: warehouses[0]._id,
        factoryId: factories[1]._id,
        productId: products[2]._id,
        quantity: 200,
        unitPrice: products[2].pricePerUnit,
        totalPrice: 200 * products[2].pricePerUnit,
        status: 'in_production',
        requestedDeliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        estimatedDeliveryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        notes: 'Please ensure proper packaging for long distance transport',
        factoryResponse: {
          message: 'Order accepted. Production started.',
          respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      },
      {
        warehouseId: warehouses[0]._id,
        factoryId: factories[2]._id,
        productId: products[5]._id,
        quantity: 300,
        unitPrice: products[5].pricePerUnit,
        totalPrice: 300 * products[5].pricePerUnit,
        status: 'accepted',
        requestedDeliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        estimatedDeliveryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        notes: 'First time order - please maintain quality standards',
        factoryResponse: {
          message: 'Thank you for choosing us. Order accepted and will start production soon.',
          respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      },
      {
        warehouseId: warehouses[1]._id,
        factoryId: factories[0]._id,
        productId: products[1]._id,
        quantity: 750,
        unitPrice: products[1].pricePerUnit,
        totalPrice: 750 * products[1].pricePerUnit,
        status: 'pending',
        requestedDeliveryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        notes: 'Bulk order for regional distribution'
      },
      {
        warehouseId: warehouses[1]._id,
        factoryId: factories[1]._id,
        productId: products[3]._id,
        quantity: 150,
        unitPrice: products[3].pricePerUnit,
        totalPrice: 150 * products[3].pricePerUnit,
        status: 'rejected',
        requestedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        notes: 'Urgent requirement due to stock shortage',
        factoryResponse: {
          message: 'Sorry, we cannot meet the delivery timeline. Current production is fully booked.',
          respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      }
    ];

    const insertedOrders = await Order.insertMany(orders);
    console.log(`Created ${insertedOrders.length} sample orders`);

    console.log('\n=== Sample Orders Created Successfully ===\n');
    console.log('Order Statuses:');
    console.log('✅ 1 Completed order');
    console.log('🔄 1 In Production order');
    console.log('✔️ 1 Accepted order');
    console.log('⏳ 1 Pending order');
    console.log('❌ 1 Rejected order\n');
    console.log('You can now test the tracking functionality!');

  } catch (error) {
    console.error('Error creating sample orders:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createSampleOrders();
