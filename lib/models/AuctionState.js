import mongoose from 'mongoose';

const auctionStateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    currentPlayerIndex: {
      type: Number,
      default: 0,
    },
    currentBid: {
      type: Number,
      default: 0,
    },
    currentBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AuctionState || mongoose.model('AuctionState', auctionStateSchema);
