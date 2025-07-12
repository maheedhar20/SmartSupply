import express, { Request, Response } from 'express';

const router = express.Router();

console.log('Bidding routes file loaded!');

// Simple test route
router.get('/test', async (req: Request, res: Response): Promise<any> => {
  try {
    console.log('Test route hit!');
    res.json({ message: 'Bidding routes are working!' });
  } catch (error) {
    console.error('Error in test route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
