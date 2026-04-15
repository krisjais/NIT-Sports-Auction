require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function fixAuctionState() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    const collection = mongoose.connection.collection('auctionstates');
    
    // Find current state
    const currentState = await collection.findOne({});
    console.log('Current state:', currentState);

    // Update status to in_progress if it's not valid
    const result = await collection.updateOne(
      {},
      {
        $set: {
          status: 'not_started',
          currentPlayerIndex: 0,
          currentBid: 0,
          currentBidder: null,
          startedAt: null,
          completedAt: null,
        }
      },
      { upsert: true }
    );

    console.log('✅ Auction state fixed!');
    console.log('Reset to:', {
      status: 'not_started',
      currentPlayerIndex: 0,
      currentBid: 0,
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAuctionState();
