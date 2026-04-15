import mongoose from 'mongoose';

const auctionLogSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    playerName: String,
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    teamName: String,
    basePrice: Number,
    soldPrice: Number,
    status: {
      type: String,
      enum: ['sold', 'unsold', 'resold'],
      required: true,
    },
    soldAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AuctionLog || mongoose.model('AuctionLog', auctionLogSchema);
