import express from 'express';
import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, factoryId, minPrice, maxPrice } = req.query;
    
    let query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (factoryId) {
      query.factoryId = factoryId;
    }
    
    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = parseFloat(minPrice as string);
      if (maxPrice) query.pricePerUnit.$lte = parseFloat(maxPrice as string);
    }

    const products = await Product.find(query).populate('factoryId', 'name location');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('factoryId', 'name location phone');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Factory only)
router.post('/', authenticate, authorize(['factory']), async (req: AuthRequest, res: Response) => {
  try {
    const productData = {
      ...req.body,
      factoryId: req.user._id,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Factory only)
router.put('/:id', authenticate, authorize(['factory']), async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      factoryId: req.user._id 
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Factory only)
router.delete('/:id', authenticate, authorize(['factory']), async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      factoryId: req.user._id 
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories
router.get('/meta/categories', async (req: Request, res: Response): Promise<any> => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
