const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: 'Mystery gift - details to be revealed!'
  },
  pointsCost: {
    type: Number,
    required: true,
    default: 50
  },
  imageUrl: {
    type: String,
    default: '/images/mystery-gift.png'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  category: {
    type: String,
    enum: ['mystery', 'food', 'experience', 'item'],
    default: 'mystery'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gift', giftSchema);