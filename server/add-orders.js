const { MongoClient } = require('mongodb');

async function addOrders() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('bidding-system');
    
    // Get some users and products
    const warehouses = await db.collection('users').find({ role: 'warehouse' }).toArray();
    const factories = await db.collection('users').find({ role: 'factory' }).toArray();
    const products = await db.collection('products').find({}).toArray();
    
    if (warehouses.length === 0 || factories.length === 0 || products.length === 0) {
      console.log('No users or products found');
      return;
    }
    
    // Clear existing orders
    await db.collection('orders').deleteMany({});
    
    // Create sample orders
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
        createdAt: new Date(),
        updatedAt: new Date()
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
        notes: 'Please ensure proper packaging',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        warehouseId: warehouses[0]._id,
        factoryId: factories[2]._id,
        productId: products[4]._id,
        quantity: 300,
        unitPrice: products[4].pricePerUnit,
        totalPrice: 300 * products[4].pricePerUnit,
        status: 'accepted',
        requestedDeliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        estimatedDeliveryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        notes: 'First time order - please maintain quality',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const result = await db.collection('orders').insertMany(orders);
    console.log('Sample orders created successfully!');
    console.log(`Created ${result.insertedCount} orders`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

addOrders();
