import express, { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create order/bid (Warehouse only)
router.post('/', authenticate, authorize(['warehouse']), async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, requestedDeliveryDate, notes } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check availability
    if (product.availableQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient product quantity available' });
    }

    if (quantity < product.minimumOrder) {
      return res.status(400).json({ message: `Minimum order quantity is ${product.minimumOrder}` });
    }

    // Create order
    const order = new Order({
      warehouseId: req.user._id,
      factoryId: product.factoryId,
      productId,
      quantity,
      unitPrice: product.pricePerUnit,
      totalPrice: product.pricePerUnit * quantity,
      requestedDeliveryDate,
      notes,
    });

    await order.save();

    // Populate the order with product and factory details
    const populatedOrder = await Order.findById(order._id)
      .populate('productId', 'name description category')
      .populate('factoryId', 'name location')
      .populate('warehouseId', 'name location');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, role } = req.query;
    
    let query: any = {};
    
    if (req.user.role === 'warehouse') {
      query.warehouseId = req.user._id;
    } else if (req.user.role === 'factory') {
      query.factoryId = req.user._id;
    }
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('productId', 'name description category images')
      .populate('factoryId', 'name location')
      .populate('warehouseId', 'name location')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('productId', 'name description category images specifications')
      .populate('factoryId', 'name location phone')
      .populate('warehouseId', 'name location phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has permission to view this order
    if (order.warehouseId._id.toString() !== req.user._id.toString() && 
        order.factoryId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Factory only)
router.patch('/:id/status', authenticate, authorize(['factory']), async (req: AuthRequest, res: Response) => {
  try {
    const { status, message, counterOffer } = req.body;

    const order = await Order.findOne({ 
      _id: req.params.id, 
      factoryId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    
    if (message || counterOffer) {
      order.factoryResponse = {
        message: message || '',
        counterOffer,
        respondedAt: new Date(),
      };
    }

    if (status === 'accepted' && counterOffer) {
      order.unitPrice = counterOffer.price;
      order.totalPrice = counterOffer.price * order.quantity;
      order.estimatedDeliveryDate = counterOffer.deliveryDate;
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('productId', 'name description category')
      .populate('factoryId', 'name location')
      .populate('warehouseId', 'name location');

    res.json(populatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order (Warehouse only)
router.patch('/:id/cancel', authenticate, authorize(['warehouse']), async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      warehouseId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order statistics
router.get('/stats/dashboard', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let query: any = {};
    
    if (req.user.role === 'warehouse') {
      query.warehouseId = req.user._id;
    } else if (req.user.role === 'factory') {
      query.factoryId = req.user._id;
    }

    const totalOrders = await Order.countDocuments(query);
    const pendingOrders = await Order.countDocuments({ ...query, status: 'pending' });
    const completedOrders = await Order.countDocuments({ ...query, status: 'completed' });
    
    const totalValueResult = await Order.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const totalValue = totalValueResult.length > 0 ? totalValueResult[0].total : 0;

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalValue,
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
