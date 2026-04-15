import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    captain: {
      type: String,
      required: true,
    },
    budgetTotal: {
      type: Number,
      default: 1000,
    },
    budgetRemaining: {
      type: Number,
      default: 1000,
    },
    budgetSpent: {
      type: Number,
      default: 0,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    logo: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model('Team', teamSchema);
