const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['player', 'admin'],
        default: 'player'
    },
    totalScore: {
        type: Number,
        default: 0
    },
    availablePoints: {
        type: Number,
        default: 0
    },
    gameProgress: {
        currentClue: {
            type: Number,
            default: 1
        },
        completedClues: [{
            type: Number
        }],
        completedTasks: [{
            type: Number
        }],
        completedGames: {
            type: Map,
            of: Boolean,
            default: {}
        },
        currentGameIndex: {
            type: Number,
            default: 0
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    photos: [{
        clueNumber: Number,
        imageUrl: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        location: {
            latitude: Number,
            longitude: Number
        }
    }],
    purchases: [{
        giftId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gift'
        },
        pointsSpent: Number,
        purchasedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Generate username based on name
userSchema.statics.generateUsername = function (name) {
    if (name.toLowerCase().includes('simran')) {
        return 'jeejeegirl';
    }

    const bollywoodNames = [
        'shahrukh', 'salman', 'aamir', 'akshay', 'hrithik', 'ranveer', 'ranbir',
        'varun', 'tiger', 'vicky', 'rajkummar', 'ayushmann', 'kartik', 'sidharth',
        'arjun', 'shahid', 'farhan', 'abhishek', 'john', 'saif', 'irrfan',
        'deepika', 'priyanka', 'katrina', 'alia', 'kareena', 'anushka', 'sonam',
        'jacqueline', 'kriti', 'shraddha', 'parineeti', 'sonakshi', 'madhuri',
        'kajol', 'rani', 'vidya', 'tabu', 'konkona', 'kangana', 'richa'
    ];

    const badassTerms = [
        'king', 'queen', 'warrior', 'champion', 'legend', 'hero', 'star',
        'badshah', 'sultan', 'tiger', 'lion', 'cobra', 'falcon', 'phoenix',
        'thunder', 'storm', 'fire', 'diamond', 'gold', 'platinum'
    ];

    const randomBollywood = bollywoodNames[Math.floor(Math.random() * bollywoodNames.length)];
    const randomTerm = badassTerms[Math.floor(Math.random() * badassTerms.length)];
    const randomNum = Math.floor(Math.random() * 999) + 1;

    const patterns = [
        `${randomBollywood}${randomTerm}`,
        `${randomTerm}${randomBollywood}`,
        `${randomBollywood}${randomNum}`,
        `${randomTerm}${randomNum}`,
        `${randomBollywood}${randomTerm}${randomNum}`
    ];

    return patterns[Math.floor(Math.random() * patterns.length)];
};

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Add points method
userSchema.methods.addPoints = function (points) {
    this.totalScore += points;
    this.availablePoints += points;
    this.gameProgress.lastUpdated = new Date();
};

// Spend points method
userSchema.methods.spendPoints = function (points) {
    if (this.availablePoints >= points) {
        this.availablePoints -= points;
        return true;
    }
    return false;
};

module.exports = mongoose.model('User', userSchema);