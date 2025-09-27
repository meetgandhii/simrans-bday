const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const GameLocation = require('../models/GameLocation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload photo with Snapchat filter
router.post('/upload', auth, upload.single('photo'), async (req, res) => {
  try {
    const { clueNumber, latitude, longitude } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No photo provided' });
    }

    // Convert buffer to base64
    const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'gafoor/f1-hunt-photos',
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' }
      ]
    });

    // Get location details for filter
    const location = await GameLocation.findOne({ clueNumber: parseInt(clueNumber) });
    
    // Add photo to user's collection
    const user = await User.findById(req.user._id);
    user.photos.push({
      clueNumber: parseInt(clueNumber),
      imageUrl: result.secure_url,
      timestamp: new Date(),
      location: {
        latitude: parseFloat(latitude || 42.3601), // Default to Boston if not provided
        longitude: parseFloat(longitude || -71.0589)
      }
    });

    await user.save();

    res.json({
      message: 'Photo uploaded successfully',
      photo: {
        id: user.photos[user.photos.length - 1]._id,
        clueNumber: parseInt(clueNumber),
        imageUrl: result.secure_url,
        timestamp: new Date(),
        location: {
          latitude: parseFloat(latitude || 42.3601),
          longitude: parseFloat(longitude || -71.0589)
        },
        filter: location?.snapchatFilter || null
      }
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Get user's photos
router.get('/my-photos', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const photos = user.photos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(photos);
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get location-specific filter
router.get('/frame/:clueNumber', async (req, res) => {
  try {
    const { clueNumber } = req.params;
    const location = await GameLocation.findOne({ clueNumber: parseInt(clueNumber) });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({
      clueNumber: location.clueNumber,
      filter: location.snapchatFilter
    });
  } catch (error) {
    console.error('Get frame error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all available filters
router.get('/filters', async (req, res) => {
  try {
    const locations = await GameLocation.find().sort({ clueNumber: 1 });
    const filters = locations.map(location => ({
      clueNumber: location.clueNumber,
      title: location.title,
      filter: location.snapchatFilter
    }));

    res.json(filters);
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete photo
router.delete('/:photoId', auth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const user = await User.findById(req.user._id);
    
    const photoIndex = user.photos.findIndex(photo => photo._id.toString() === photoId);
    if (photoIndex === -1) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Remove from array
    user.photos.splice(photoIndex, 1);
    await user.save();

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
