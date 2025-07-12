import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import BidRequest from '../models/BidRequest';
import Bid from '../models/Bid';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const auth = authenticate;

// Simple test route first
router.get('/test', (req, res) => {
  res.json({ message: 'Bidding routes are working!' });
});

// Test route with MongoDB connection
router.get('/health', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({ 
      message: 'Bidding health check', 
      mongoConnected: isConnected,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Get all active bid requests (for factories to view)
router.get('/requests', auth, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { status: 'active' };

    // Add category filter if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const bidRequests = await BidRequest.find(filter)
      .populate('warehouseId', 'name location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BidRequest.countDocuments(filter);

    res.json({
      bidRequests,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching bid requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;