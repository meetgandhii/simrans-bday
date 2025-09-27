# F1 Birthday Hunt - Full-Stack Web Application

A complete full-stack web application for an F1-themed birthday scavenger hunt in Boston with location-based challenges, camera functionality, maps integration, points system, and gift shop.

## 🏁 Features

- **7 F1-themed clues** with interactive puzzles (Word Search, Shopping List, Trivia, Jigsaw)
- **Real-time geolocation** and maps with location markers
- **Camera interface** with Snapchat-style filters for each location
- **Points system** with bonus challenges
- **Gift shop** where users can spend earned points
- **Admin panel** for game management
- **Mobile-first responsive design** with F1 red theme
- **JWT authentication** with role-based access
- **Cloudinary integration** for photo storage

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for photo storage)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd gafoor_bday_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/f1-hunt
JWT_SECRET=your-super-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd gafoor_bday_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your configuration:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name
REACT_APP_CLOUDINARY_API_KEY=your-api-key
REACT_APP_CLOUDINARY_API_SECRET=your-api-secret
```

5. Start the frontend development server:
```bash
npm start
```

## 🎮 Game Flow

### 7 F1 Clues

1. **Pit Stop Word Search** - Find words at Trader Joe's Boylston
2. **Smooth Operator Shopping** - Collect items spelling "DUNKIN"
3. **Victory Lap Trivia** - F1 knowledge at Nike Store
4. **Sweet Victory Jigsaw** - Complete puzzle at JP Licks
5. **Ducklings Word Search** - Find words at Boston Public Garden
6. **Nature Artist Trivia** - Test knowledge at Arnold Arboretum
7. **Championship Finale** - Final word search at Charles River

### Points System

- **Base points**: 100 per clue
- **Bonus points**: 50 per bonus task
- **Final clue**: 200 base + 100 bonus

### Gift Shop

Users can spend earned points on mystery gifts (A, B, C, D, E, F) with varying point costs.

## 🔧 Admin Features

### Making a User Admin

```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne(
  {email: "admin@example.com"}, 
  {$set: {role: "admin"}}
)
```

### Admin Capabilities

- View all users and their progress
- Skip clues for any user
- Monitor game statistics
- Manage gift shop inventory
- Seed default gifts

## 📱 Mobile Features

- **Responsive design** optimized for mobile devices
- **Camera integration** with device camera access
- **Geolocation** for location-based challenges
- **Touch-friendly interface** with large buttons
- **Offline maps** with cached tiles

## 🎨 F1 Theme

- **Colors**: F1 Red (#e10600), Black, White
- **Typography**: Modern, bold fonts
- **Animations**: Smooth transitions and hover effects
- **Icons**: Lucide React icons
- **Patterns**: Checkered flag backgrounds

## 🗺️ Boston Locations

1. **Trader Joe's Boylston** - 899 Boylston St, Boston, MA 02115
2. **Dunkin' Donuts** - Multiple locations in Boston
3. **Nike Store Newbury** - 200 Newbury St, Boston, MA 02116
4. **JP Licks** - 352 Newbury St, Boston, MA 02115
5. **Boston Public Garden** - 4 Charles St, Boston, MA 02116
6. **Arnold Arboretum** - 125 Arborway, Boston, MA 02130
7. **Charles River** - Charles River Esplanade, Boston, MA

## 🔐 Security Features

- **JWT authentication** with 7-day expiration
- **Password hashing** with bcrypt
- **Rate limiting** on API endpoints
- **CORS protection** with specific origins
- **Input validation** and sanitization
- **Helmet.js** for security headers

## 📸 Photo Features

- **Cloudinary integration** for image storage
- **Image compression** before upload
- **Location-specific filters** for each clue
- **Photo gallery** with user's captured images
- **Metadata storage** (location, timestamp, clue number)

## 🛠️ Development

### Backend Structure

```
gafoor_bday_backend/
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── middleware/      # Authentication & validation
└── server.js        # Express server
```

### Frontend Structure

```
gafoor_bday_frontend/
├── src/
│   ├── components/  # React components
│   ├── services/    # API calls
│   ├── utils/       # Helper functions
│   └── context/     # React context
└── public/          # Static assets
```

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Configure environment variables for production
3. Deploy to Heroku, Vercel, or your preferred platform
4. Set up Cloudinary for image storage

### Frontend Deployment

1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred platform
3. Configure environment variables
4. Update API URL to point to your backend

## 🎯 Game Rules

1. **Sequential Progress**: Clues must be completed in order
2. **Location Verification**: Users must be near the location to complete clues
3. **Photo Evidence**: Camera photos are required for bonus points
4. **Time Limit**: No time limit, but progress is saved
5. **Admin Override**: Admins can skip clues for any user

## 🏆 Scoring

- **Perfect Score**: 1,050 points (all clues + all bonus tasks)
- **Podium Finish**: 700+ points
- **Points Scorer**: 400+ points
- **Race Finisher**: Any completion

## 📞 Support

For technical support or game assistance, contact the game administrator.

## 🎉 Happy Birthday Simran!

"Smooth operator... smooth operation" - Carlos Sainz

---

Built with ❤️ for an amazing F1-themed birthday celebration!
