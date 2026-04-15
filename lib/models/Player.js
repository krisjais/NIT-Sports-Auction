import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    skills: [String],
    basePrice: {
      type: Number,
      required: true,
      default: 50,
    },
    photoUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'unsold', 'resold'],
      default: 'available',
    },
    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    soldPrice: {
      type: Number,
      default: null,
    },
    soldAt: {
      type: Date,
      default: null,
    },
    isResold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Player || mongoose.model('Player', playerSchema);
