/**
 * Database Seed Script
 * Run this to initialize the database with sample data
 * Usage: node scripts/seedDatabase.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Define schemas inline
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'viewer'], default: 'viewer' },
  email: { type: String, sparse: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  captain: { type: String, required: true },
  budgetTotal: { type: Number, default: 1000 },
  budgetRemaining: { type: Number, default: 1000 },
  budgetSpent: { type: Number, default: 0 },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
}, { timestamps: true });

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  category: { type: String, required: true },
  skills: [String],
  basePrice: { type: Number, required: true, min: 50 },
  status: { type: String, enum: ['available', 'sold', 'unsold', 'resold'], default: 'available' },
  soldTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  soldPrice: { type: Number },
  isResold: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
const Player = mongoose.models.Player || mongoose.model('Player', playerSchema);

const sampleTeams = [
  { name: 'Phoenix Warriors', captain: 'Rajesh Kumar' },
  { name: 'Thunder Strikers', captain: 'Amit Singh' },
  { name: 'Golden Titans', captain: 'Vikram Patel' },
  { name: 'Blue Storm', captain: 'Arjun Verma' },
  { name: 'Red Eagles', captain: 'Rohan Sharma' },
  { name: 'Green Force', captain: 'Nikhil Desai' },
  { name: 'Silver Squadron', captain: 'Karthik Iyer' },
  { name: 'Crimson Kings', captain: 'Sanjay Reddy' },
];

const samplePlayers = [
  {
    name: 'Virat Kohli',
    department: 'CSE',
    category: 'Batsman',
    basePrice: 100,
    skills: ['Batting', 'Leadership', 'Fielding'],
  },
  {
    name: 'Jasprit Bumrah',
    department: 'ECE',
    category: 'Bowler',
    basePrice: 90,
    skills: ['Bowling', 'Accuracy', 'Death Bowling'],
  },
  {
    name: 'Rohit Sharma',
    department: 'ME',
    category: 'Batsman',
    basePrice: 95,
    skills: ['Batting', 'Leadership'],
  },
  {
    name: 'Ravindra Jadeja',
    department: 'CSE',
    category: 'All-rounder',
    basePrice: 85,
    skills: ['Batting', 'Bowling', 'Fielding'],
  },
  {
    name: 'MS Dhoni',
    department: 'IT',
    category: 'Wicket-keeper',
    basePrice: 88,
    skills: ['Keeping', 'Batting', 'Leadership'],
  },
  {
    name: 'Suryakumar Yadav',
    department: 'EE',
    category: 'Batsman',
    basePrice: 80,
    skills: ['Batting', 'Fielding', 'Flexibility'],
  },
  {
    name: 'Hardik Pandya',
    department: 'ME',
    category: 'All-rounder',
    basePrice: 82,
    skills: ['Batting', 'Bowling', 'Fielding'],
  },
  {
    name: 'Yuzvendra Chahal',
    department: 'CSE',
    category: 'Bowler',
    basePrice: 75,
    skills: ['Bowling', 'Leg Spin', 'Accuracy'],
  },
  // Add more players to reach 56
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});

    console.log('Creating admin user...');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(process.env.ADMIN_PASSWORD, salt);

    await User.create({
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Creating teams...');
    const createdTeams = await Team.insertMany(
      sampleTeams.map((team) => ({
        ...team,
        budgetTotal: 1000,
        budgetRemaining: 1000,
        budgetSpent: 0,
      }))
    );

    console.log('Creating players...');
    // Expand players to 56
    const expandedPlayers = [];
    for (let i = 0; i < 7; i++) {
      samplePlayers.forEach((player) => {
        expandedPlayers.push({
          ...player,
          name: `${player.name} ${i + 1}`,
        });
      });
    }

    await Player.insertMany(expandedPlayers.slice(0, 56));

    console.log('✅ Database seeded successfully!');
    console.log(`Created ${sampleTeams.length} teams`);
    console.log('Created 56 players');
    console.log('Created admin user');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
