import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all factories with their products
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { search, latitude, longitude, radius = 50 } = req.query;
    
    let query: any = { role: 'factory' };
    
    // If location is provided, add geospatial filtering
    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radiusKm = parseFloat(radius as string);
      
      // Simple distance calculation (can be improved with proper geospatial indexing)
      query['$where'] = function() {
        const factoryLat = this.location.latitude;
        const factoryLng = this.location.longitude;
        const distance = Math.sqrt(
          Math.pow(factoryLat - lat, 2) + Math.pow(factoryLng - lng, 2)
        ) * 111; // Approximate km per degree
        return distance <= radiusKm;
      };
    }

    if (search) {
      query['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }

    const factories = await User.find(query, { password: 0 });
    
    // Get products for each factory
    const factoriesWithProducts = await Promise.all(
      factories.map(async (factory) => {
        const products = await Product.find({ 
          factoryId: factory._id, 
          isActive: true 
        });
        return {
          ...factory.toObject(),
          products,
          productCount: products.length,
        };
      })
    );

    res.json(factoriesWithProducts);
  } catch (error) {
    console.error('Error fetching factories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get factory by ID
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const factory = await User.findOne({ 
      _id: req.params.id, 
      role: 'factory' 
    }, { password: 0 });
    
    if (!factory) {
      return res.status(404).json({ message: 'Factory not found' });
    }

    const products = await Product.find({ 
      factoryId: factory._id, 
      isActive: true 
    });

    res.json({
      ...factory.toObject(),
      products,
    });
  } catch (error) {
    console.error('Error fetching factory:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search factories with smart filtering (lowest cost + nearest)
router.post('/search', async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      productName, 
      category, 
      quantity, 
      warehouseLocation,
      maxDistance = 100,
      sortBy = 'smart' // 'price', 'distance', 'smart'
    } = req.body;

    // Find products matching criteria
    let productQuery: any = { isActive: true };
    
    if (productName) {
      productQuery.name = { $regex: productName, $options: 'i' };
    }
    
    if (category) {
      productQuery.category = category;
    }
    
    if (quantity) {
      productQuery.$and = [
        { availableQuantity: { $gte: quantity } },
        { minimumOrder: { $lte: quantity } }
      ];
    }

    const products = await Product.find(productQuery).populate('factoryId');
    
    // Filter by distance and calculate scores
    const results = products
      .map(product => {
        const factory = product.factoryId as any;
        
        // Calculate distance
        const distance = calculateDistance(
          warehouseLocation.latitude,
          warehouseLocation.longitude,
          factory.location.latitude,
          factory.location.longitude
        );
        
        if (distance > maxDistance) return null;
        
        // Calculate smart score (lower is better)
        const priceScore = product.pricePerUnit / 1000; // Normalize price
        const distanceScore = distance / 100; // Normalize distance
        const smartScore = priceScore + distanceScore;
        
        return {
          product: product.toObject(),
          factory: {
            id: factory._id,
            name: factory.name,
            location: factory.location,
          },
          distance,
          totalPrice: product.pricePerUnit * (quantity || 1),
          smartScore,
        };
      })
      .filter(Boolean);

    // Sort results
    if (sortBy === 'price') {
      results.sort((a, b) => a!.totalPrice - b!.totalPrice);
    } else if (sortBy === 'distance') {
      results.sort((a, b) => a!.distance - b!.distance);
    } else {
      results.sort((a, b) => a!.smartScore - b!.smartScore);
    }

    res.json(results);
  } catch (error) {
    console.error('Error searching factories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;
