const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Test endpoint to upload a dummy image
router.post('/test-upload', upload.single('image'), async (req, res) => {
  try {
    console.log('Testing Cloudinary connection...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');

    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Convert buffer to base64
    const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'gafoor/test',
      public_id: `test-${Date.now()}`,
      transformation: [
        { width: 400, height: 300, crop: 'fill', quality: 'auto' }
      ]
    });

    console.log('Upload successful:', result.secure_url);

    res.json({
      success: true,
      message: 'Image uploaded successfully!',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      folder: 'gafoor/test'
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Upload failed',
      error: error.message 
    });
  }
});

// Test endpoint to check Cloudinary config
router.get('/test-config', (req, res) => {
  const config = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    timestamp: new Date().toISOString()
  };

  console.log('Cloudinary config check:', config);
  res.json(config);
});

module.exports = router;
