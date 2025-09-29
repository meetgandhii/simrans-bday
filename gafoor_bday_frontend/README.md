# 🏎️ Birthday Treasure Hunt - React App

A React-based scavenger hunt game themed around Formula 1 and Carlos Sainz, created for Simran's birthday celebration.

## 📁 Project Structure

```
f1-birthday-hunt/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js           # Authentication component
│   │   ├── Header.js          # Top navigation with user info
│   │   ├── ScoreDisplay.js    # Points and progress tracking
│   │   ├── ClueCard.js        # Individual challenge cards
│   │   ├── GameBoard.js       # Main game orchestration
│   │   ├── WordSearch.js      # Interactive word finding game
│   │   ├── ShoppingList.js    # Checkbox-based shopping puzzle
│   │   ├── TriviaQuestion.js  # Multiple choice questions
│   │   └── JigsawPuzzle.js    # Puzzle mini-game
│   ├── context/
│   │   └── AuthContext.js     # Authentication context
│   ├── App.js                 # Main app component
│   ├── index.js              # App entry point
│   └── index.css             # Tailwind CSS imports
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or download the project files
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Play

### For Players
1. **Login**: Enter your name and email (password optional)
   - Special case: Names containing "simran" get username "jeejeegirl"
   - Other names get auto-generated usernames (e.g., "john123")

2. **Complete Challenges**: Progress through 7 F1-themed clues
   - Each clue worth 100 base points
   - Bonus tasks worth +50 points each
   - Total possible: 1050 points

3. **Game Flow**: 
   - Complete puzzles or enter correct answers to progress
   - Visit real Boston locations as part of the hunt
   - Take photos and complete bonus challenges

### For Admins
- **Login**: Name "admin", password "admin123"
- **Special Powers**:
  - Orange "Skip" button on each clue
  - Can bypass answer validation
  - Automatic bonus task approval
  - Admin control panel with clue navigation
  - Reset game functionality

## 🏁 Game Challenges

1. **Word Search** - Find F1-related words that spell "TRADER JOES BOYLSTON CHIPS JERK"
2. **Shopping List** - Check items whose first letters spell "DUNKIN"
3. **F1 Trivia** - Answer questions about Carlos Sainz to find "NIKE"
4. **Photo Challenge** - Take victory poses at Nike store
5. **Jigsaw Puzzles** - Solve Carlos and cat puzzles to discover "PUBLIC GARDEN"
6. **Duck Celebration** - Victory dance with Make Way for Ducklings statues
7. **Art Creation** - Paint at Arnold Arboretum before heading to Charles River

## 🎨 Features

### Authentication System
- **Smart Username Generation**: Automatic username creation based on name
- **Admin Access**: Special privileges for game masters
- **Session Management**: Persistent login throughout the game

### Game Components
- **Interactive Word Search**: Click-and-drag letter selection
- **Dynamic Shopping Lists**: Real-time first-letter tracking
- **Trivia Questions**: Multiple choice with immediate feedback
- **Puzzle Games**: Drag-and-drop jigsaw functionality
- **Progress Tracking**: Visual progress bar and score animations

### Admin Features
- **Skip Controls**: Orange skip buttons on each clue
- **Bypass System**: Admin can skip answer validation
- **Control Panel**: Jump to any clue, reset game progress
- **Bonus Approval**: Automatic approval for bonus tasks

## 🎯 Scoring System

| Challenge Type | Points |
|----------------|--------|
| Base Clue Completion | 100 pts |
| Bonus Tasks | 50 pts |
| **Total Possible** | **1,050 pts** |

### Score Grades
- **1000+ pts**: Perfect Champion! 🏆
- **700+ pts**: Podium Finish! 🥈  
- **400+ pts**: Points Scorer! 🏁
- **Below 400**: Finished the Race! 🎉

## 🏗️ Technical Details

### Built With
- **React 18** - Component-based UI framework
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library
- **Context API** - State management for authentication

### Custom Tailwind Config
- **F1 Colors**: Custom red (#e10600) and silver themes
- **Animations**: Fade-in transitions, pulse effects, floating elements
- **F1 Flag Pattern**: CSS utility for checkered flag design

### Component Architecture
- **Modular Design**: Each game element as separate component
- **State Management**: Centralized score and progress tracking
- **Event Handling**: Real-time user interaction feedback
- **Responsive Design**: Mobile-first approach with Tailwind

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect GitHub repository for auto-deployment
- **GitHub Pages**: Use `npm run build` then deploy build folder
- **Firebase Hosting**: Use Firebase CLI tools

## 🔧 Customization

### Adding New Clues
1. Edit `src/components/GameBoard.js`
2. Add new clue object to `clues` array
3. Create component if needed in `src/components/`
4. Update total clue count in progress calculation

### Styling Changes
1. Modify `tailwind.config.js` for theme changes
2. Update `src/index.css` for global styles
3. Component styles use Tailwind utility classes

### Admin Controls
- Change admin credentials in `src/components/Login.js`
- Modify admin approval code (currently "5555")
- Add new admin features in `GameBoard.js`

## 📱 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS 14+, Android 10+)

## 🎮 Game Flow

```
Login → Clue 1 (Word Search) → Trader Joe's
  ↓
Clue 2 (Shopping) → Dunkin Donuts
  ↓  
Clue 3 (Trivia) → Nike Store
  ↓
Clue 4 (Photo) → JP Licks
  ↓
Clue 5 (Puzzles) → Public Garden
  ↓
Clue 6 (Duck Dance) → Arnold Arboretum
  ↓
Clue 7 (Art) → Charles River Finish!
```

## 🏆 Carlos Sainz Theme

The game celebrates Carlos Sainz Jr. (#55) with references to:
- "Smooth Operator" nickname
- Ferrari red color scheme
- Spanish heritage
- Victory celebrations
- F1 racing terminology

## 🎂 Birthday Features

- Personalized for Simran with special username "jeejeegirl"
- Boston-specific locations and challenges  
- Photo opportunities at iconic city spots
- Celebration animations and confetti effects
- Birthday wishes in completion screen

---

**Happy Racing! 🏎️**