const express = require('express');
const User = require('../models/User');
const Gift = require('../models/Gift');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get available gifts
router.get('/gifts', async (req, res) => {
  try {
    const gifts = await Gift.find({ isAvailable: true }).sort({ pointsCost: 1 });
    res.json(gifts);
  } catch (error) {
    console.error('Get gifts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase gift
router.post('/purchase', auth, async (req, res) => {
  try {
    const { giftId } = req.body;
    const user = await User.findById(req.user._id);
    
    // Find gift
    const gift = await Gift.findById(giftId);
    if (!gift) {
      return res.status(404).json({ message: 'Gift not found' });
    }

    if (!gift.isAvailable) {
      return res.status(400).json({ message: 'Gift is not available' });
    }

    // Check stock
    if (gift.stock !== -1 && gift.stock <= 0) {
      return res.status(400).json({ message: 'Gift is out of stock' });
    }

    // Check if user has enough points
    if (user.availablePoints < gift.pointsCost) {
      return res.status(400).json({ 
        message: 'Insufficient points',
        required: gift.pointsCost,
        available: user.availablePoints
      });
    }

    // Process purchase
    const success = user.spendPoints(gift.pointsCost);
    if (!success) {
      return res.status(400).json({ message: 'Failed to process purchase' });
    }

    // Add to user's purchases
    user.purchases.push({
      giftId: gift._id,
      pointsSpent: gift.pointsCost,
      purchasedAt: new Date()
    });

    // Update gift stock
    if (gift.stock !== -1) {
      gift.stock -= 1;
      if (gift.stock === 0) {
        gift.isAvailable = false;
      }
      await gift.save();
    }

    await user.save();

    res.json({
      message: 'Purchase successful!',
      gift: {
        name: gift.name,
        description: gift.description,
        pointsSpent: gift.pointsCost
      },
      remainingPoints: user.availablePoints
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's purchase history
router.get('/purchases', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('purchases.giftId');
    
    const purchases = user.purchases.map(purchase => ({
      id: purchase._id,
      gift: {
        name: purchase.giftId.name,
        description: purchase.giftId.description,
        imageUrl: purchase.giftId.imageUrl
      },
      pointsSpent: purchase.pointsSpent,
      purchasedAt: purchase.purchasedAt
    }));

    res.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed default gifts
router.post('/seed-gifts', async (req, res) => {
  try {
    const count = await Gift.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Gifts already seeded' });
    }

    const defaultGifts = [
      {
        name: 'Gift A',
        description: 'Mystery gift - details to be revealed!',
        pointsCost: 50,
        imageUrl: '/images/mystery-gift.png',
        category: 'mystery'
      },
      {
        name: 'Gift B',
        description: 'Mystery gift - details to be revealed!',
        pointsCost: 75,
        imageUrl: '/images/mystery-gift.png',
        category: 'mystery'
      },
      {
        name: 'Gift C',
        description: 'Mystery gift - details to be revealed!',
        pointsCost: 100,
        imageUrl: '/images/mystery-gift.png',
        category: 'mystery'
      },
      {
        name: 'Gift D',
        description: 'Mystery gift - details to be revealed!',
        pointsCost: 150,
        imageUrl: '/images/mystery-gift.png',
        category: 'mystery'
      },
      {
        name: 'Gift E',
        description: 'Mystery gift - details to be revealed!',
        pointsCost: 200,
        imageUrl: '/images/mystery-gift.png',
        category: 'mystery'
      },
      {
        name: 'Gift F',
        description: 'Mystery gift - details to be revealed!',
        pointsCost: 300,
        imageUrl: '/images/mystery-gift.png',
        category: 'mystery'
      }
    ];

    await Gift.insertMany(defaultGifts);
    res.json({ message: 'Gifts seeded successfully' });
  } catch (error) {
    console.error('Seed gifts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
