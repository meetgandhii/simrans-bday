const mongoose = require('mongoose');

const gameLocationSchema = new mongoose.Schema({
  clueNumber: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  address: String,
  placeName: String,
  isActive: {
    type: Boolean,
    default: true
  },
  snapchatFilter: {
    frameUrl: String,
    overlayText: String,
    position: {
      type: String,
      enum: ['top', 'bottom', 'center', 'corner'],
      default: 'bottom'
    }
  }
}, {
  timestamps: true
});

// Boston locations for the F1 hunt
const defaultLocations = [
  {
    clueNumber: 1,
    title: "Trader Joe's Boylston",
    coordinates: { latitude: 42.3515, longitude: -71.0795 },
    address: "899 Boylston St, Boston, MA 02115",
    placeName: "Trader Joe's",
    snapchatFilter: {
      frameUrl: "/frames/f1-checkered.png",
      overlayText: "Pit Stop Complete! 🏁"
    }
  },
  {
    clueNumber: 2,
    title: "Dunkin' Donuts",
    coordinates: { latitude: 42.3501, longitude: -71.0764 },
    address: "Multiple locations in Boston",
    placeName: "Dunkin'",
    snapchatFilter: {
      frameUrl: "/frames/coffee-cup.png",
      overlayText: "Smooth Operator ☕"
    }
  },
  {
    clueNumber: 3,
    title: "Nike Store Newbury",
    coordinates: { latitude: 42.3502, longitude: -71.0759 },
    address: "200 Newbury St, Boston, MA 02116",
    placeName: "Nike Store",
    snapchatFilter: {
      frameUrl: "/frames/victory-pose.png",
      overlayText: "Just Do It! 👟"
    }
  },
  {
    clueNumber: 4,
    title: "JP Licks",
    coordinates: { latitude: 42.3467, longitude: -71.0707 },
    address: "352 Newbury St, Boston, MA 02115",
    placeName: "JP Licks Ice Cream",
    snapchatFilter: {
      frameUrl: "/frames/ice-cream.png",
      overlayText: "Sweet Victory! 🍦"
    }
  },
  {
    clueNumber: 5,
    title: "Boston Public Garden",
    coordinates: { latitude: 42.3541, longitude: -71.0655 },
    address: "4 Charles St, Boston, MA 02116",
    placeName: "Public Garden",
    snapchatFilter: {
      frameUrl: "/frames/duck-border.png",
      overlayText: "Make Way for Ducklings! 🦆"
    }
  },
  {
    clueNumber: 6,
    title: "Arnold Arboretum",
    coordinates: { latitude: 42.3014, longitude: -71.1249 },
    address: "125 Arborway, Boston, MA 02130",
    placeName: "Arnold Arboretum",
    snapchatFilter: {
      frameUrl: "/frames/tree-frame.png",
      overlayText: "Nature Artist! 🎨"
    }
  },
  {
    clueNumber: 7,
    title: "Charles River",
    coordinates: { latitude: 42.3601, longitude: -71.0589 },
    address: "Charles River Esplanade, Boston, MA",
    placeName: "Charles River",
    snapchatFilter: {
      frameUrl: "/frames/sunset-crown.png",
      overlayText: "Birthday Champion! 🏆"
    }
  }
];

gameLocationSchema.statics.seedLocations = async function() {
  try {
    const count = await this.countDocuments();
    if (count === 0) {
      await this.insertMany(defaultLocations);
      console.log('Game locations seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding locations:', error);
  }
};

module.exports = mongoose.model('GameLocation', gameLocationSchema);