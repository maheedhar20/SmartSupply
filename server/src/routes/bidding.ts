import express from 'express';
import BidRequest from '../models/BidRequest';
import Bid from '../models/Bid';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const auth = authenticate;

// Get all active bid requests (for factories to view)
router.get('/requests', auth, async (req: AuthRequest, res) => {
  try {
    const bidRequests = await BidRequest.find({ 
      status: 'open',
      biddingDeadline: { $gt: new Date() }
    })
    .populate('warehouseId', 'name location')
    .sort({ createdAt: -1 });

    res.json(bidRequests);
  } catch (error) {
    console.error('Error fetching bid requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new bid request (warehouse only)
router.post('/requests', auth, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    
    if (user.role !== 'warehouse') {
      return res.status(403).json({ message: 'Only warehouses can create bid requests' });
    }

    const {
      productName,
      category,
      quantity,
      specifications,
      budget,
      timeline,
      bidRequirements,
      biddingDeadline,
      notes
    } = req.body;

    // Set bidding deadline if not provided (default: 7 days from now)
    const deadline = biddingDeadline ? new Date(biddingDeadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const bidRequest = new BidRequest({
      warehouseId: user._id,
      productName,
      category,
      quantity,
      specifications,
      budget,
      timeline,
      bidRequirements,
      biddingDeadline: deadline,
      notes
    });

    await bidRequest.save();
    await bidRequest.populate('warehouseId', 'name location');
    
    res.status(201).json(bidRequest);
  } catch (error) {
    console.error('Error creating bid request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bid requests by warehouse
router.get('/my-requests', auth, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    
    if (user.role !== 'warehouse') {
      return res.status(403).json({ message: 'Only warehouses can view their bid requests' });
    }

    const bidRequests = await BidRequest.find({ warehouseId: user._id })
      .populate('warehouseId', 'name location')
      .sort({ createdAt: -1 });

    // Get bid counts for each request
    const requestsWithBidCounts = await Promise.all(
      bidRequests.map(async (request) => {
        const bidCount = await Bid.countDocuments({ bidRequestId: request._id });
        return {
          ...request.toObject(),
          bidCount
        };
      })
    );

    res.json(requestsWithBidCounts);
  } catch (error) {
    console.error('Error fetching warehouse bid requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get individual bid request by ID
router.get('/requests/:id', auth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const bidRequest = await BidRequest.findById(id)
      .populate('warehouseId', 'name location contactInfo');

    if (!bidRequest) {
      return res.status(404).json({ message: 'Bid request not found' });
    }

    // Check if user has permission to view this bid request
    if (req.user.role === 'warehouse' && bidRequest.warehouseId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Count bids for this request
    const bidCount = await Bid.countDocuments({ bidRequestId: id });

    res.json({
      ...bidRequest.toObject(),
      bidCount
    });
  } catch (error) {
    console.error('Error fetching bid request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a bid (factory only)
router.post('/requests/:requestId/bid', auth, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    const { requestId } = req.params;
    
    if (user.role !== 'factory') {
      return res.status(403).json({ message: 'Only factories can submit bids' });
    }

    // Check if bid request exists and is still open
    const bidRequest = await BidRequest.findById(requestId);
    if (!bidRequest) {
      return res.status(404).json({ message: 'Bid request not found' });
    }

    if (bidRequest.status !== 'open') {
      return res.status(400).json({ message: 'Bid request is no longer open' });
    }

    if (new Date() > bidRequest.biddingDeadline) {
      return res.status(400).json({ message: 'Bidding deadline has passed' });
    }

    // Check if factory already submitted a bid
    const existingBid = await Bid.findOne({ 
      bidRequestId: requestId, 
      factoryId: user._id 
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already submitted a bid for this request' });
    }

    const {
      pricing,
      delivery,
      qualityAssurance,
      factoryCapacity,
      proposal,
      competitiveAdvantages,
      validUntil
    } = req.body;

    // Set bid validity (default: 30 days from now)
    const validity = validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const bid = new Bid({
      bidRequestId: requestId,
      factoryId: user._id,
      pricing,
      delivery,
      qualityAssurance,
      factoryCapacity,
      proposal,
      competitiveAdvantages,
      validUntil: validity
    });

    await bid.save();
    await bid.populate('factoryId', 'name location businessType');
    
    res.status(201).json(bid);
  } catch (error) {
    console.error('Error submitting bid:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bids for a specific bid request (warehouse only)
router.get('/requests/:requestId/bids', auth, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    const { requestId } = req.params;
    
    if (user.role !== 'warehouse') {
      return res.status(403).json({ message: 'Only warehouses can view bids for their requests' });
    }

    // Verify that the bid request belongs to the warehouse
    const bidRequest = await BidRequest.findOne({ 
      _id: requestId, 
      warehouseId: user._id 
    });

    if (!bidRequest) {
      return res.status(404).json({ message: 'Bid request not found or unauthorized' });
    }

    const bids = await Bid.find({ bidRequestId: requestId })
      .populate('factoryId', 'name location businessType contactInfo')
      .sort({ 'pricing.totalPrice': 1 }); // Sort by price (lowest first)

    res.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a bid (warehouse only)
router.patch('/bids/:bidId/accept', auth, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    const { bidId } = req.params;
    
    if (user.role !== 'warehouse') {
      return res.status(403).json({ message: 'Only warehouses can accept bids' });
    }

    const bid = await Bid.findById(bidId)
      .populate({
        path: 'bidRequestId',
        populate: {
          path: 'warehouseId',
          select: 'name location'
        }
      });
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Verify that the bid request belongs to the warehouse
    if ((bid.bidRequestId as any).warehouseId._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to accept this bid' });
    }

    // Update bid status
    bid.status = 'accepted';
    await bid.save();

    // Close the bid request
    const bidRequest = await BidRequest.findById(bid.bidRequestId._id);
    if (bidRequest) {
      bidRequest.status = 'awarded';
      await bidRequest.save();
    }

    // Reject all other bids for this request
    await Bid.updateMany(
      { 
        bidRequestId: bid.bidRequestId._id, 
        _id: { $ne: bidId },
        status: 'submitted'
      },
      { status: 'rejected' }
    );

    res.json({ message: 'Bid accepted successfully', bid });
  } catch (error) {
    console.error('Error accepting bid:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get factory's bids
router.get('/my-bids', auth, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    
    if (user.role !== 'factory') {
      return res.status(403).json({ message: 'Only factories can view their bids' });
    }

    const bids = await Bid.find({ factoryId: user._id })
      .populate('bidRequestId', 'productName category quantity status biddingDeadline')
      .populate('bidRequestId.warehouseId', 'name location')
      .sort({ submittedAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Error fetching factory bids:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update bid status (factory only)
router.patch('/bids/:bidId/status', auth, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    const { bidId } = req.params;
    const { status } = req.body;
    
    if (user.role !== 'factory') {
      return res.status(403).json({ message: 'Only factories can update their bids' });
    }

    const validStatuses = ['submitted', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const bid = await Bid.findOne({ _id: bidId, factoryId: user._id });
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    if (bid.status !== 'submitted') {
      return res.status(400).json({ message: 'Can only update submitted bids' });
    }

    bid.status = status;
    bid.updatedAt = new Date();
    await bid.save();

    res.json({ message: 'Bid status updated successfully', bid });
  } catch (error) {
    console.error('Error updating bid status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;