import AuctionLog from '@/lib/models/AuctionLog';
import AuctionState from '@/lib/models/AuctionState';
import Player from '@/lib/models/Player';
import Team from '@/lib/models/Team';
import { connectDB } from '@/lib/db/connection';

export async function initializeAuctionState() {
  await connectDB();

  let state = await AuctionState.findOne();
  if (!state) {
    state = new AuctionState({
      status: 'not_started',
      currentPlayerIndex: 0,
    });
    await state.save();
  }

  return state;
}

export async function getAuctionState() {
  await connectDB();
  let state = await AuctionState.findOne().populate('currentBidder');

  if (!state) {
    state = await initializeAuctionState();
  }

  return state;
}

export async function startAuction() {
  await connectDB();

  let state = await AuctionState.findOne();
  if (!state) {
    state = new AuctionState();
  }

  state.status = 'in_progress';
  state.startedAt = new Date();
  state.currentPlayerIndex = 0;
  state.currentBid = 0;
  state.currentBidder = null;

  return state.save();
}

export async function placeBid(teamId, bidAmount) {
  await connectDB();

  const state = await AuctionState.findOne();
  if (!state || state.status !== 'in_progress') {
    throw new Error('Auction not in progress');
  }

  if (bidAmount <= state.currentBid) {
    throw new Error('Bid must be higher than current bid');
  }

  const team = await Team.findById(teamId);
  if (!team || team.budgetRemaining < bidAmount) {
    throw new Error('Insufficient budget for this bid');
  }

  state.currentBid = bidAmount;
  state.currentBidder = teamId;

  return state.save();
}

export async function sellPlayer(teamId, playerId, soldPrice) {
  await connectDB();

  const player = await Player.findById(playerId);
  if (!player) throw new Error('Player not found');

  const team = await Team.findById(teamId);
  if (!team) throw new Error('Team not found');

  // Check player limit
  if (team.players.length >= 7) {
    throw new Error('Team has reached player limit');
  }

  // Check budget
  if (team.budgetRemaining < soldPrice) {
    throw new Error('Insufficient budget');
  }

  // Update player
  player.status = 'sold';
  player.soldTo = teamId;
  player.soldPrice = soldPrice;
  player.soldAt = new Date();
  await player.save();

  // Update team
  team.players.push(playerId);
  team.budgetRemaining -= soldPrice;
  team.budgetSpent += soldPrice;
  await team.save();

  // Log auction
  const log = new AuctionLog({
    playerId,
    playerName: player.name,
    teamId,
    teamName: team.name,
    basePrice: player.basePrice,
    soldPrice,
    status: 'sold',
  });
  await log.save();

  return { player, team, log };
}

export async function markPlayerUnsold(playerId) {
  await connectDB();

  const player = await Player.findById(playerId);
  if (!player) throw new Error('Player not found');

  player.status = 'unsold';
  await player.save();

  const log = new AuctionLog({
    playerId,
    playerName: player.name,
    basePrice: player.basePrice,
    status: 'unsold',
  });
  await log.save();

  return { player, log };
}

export async function handleResale(teamId) {
  await connectDB();

  const team = await Team.findById(teamId).populate('players');
  if (!team) throw new Error('Team not found');

  if (team.players.length < 7) {
    // Find highest priced player
    const players = team.players.sort((a, b) => b.soldPrice - a.soldPrice);

    if (players.length === 0) {
      throw new Error('No players to resell');
    }

    const playerToResell = players[0];
    const refundAmount = playerToResell.soldPrice;

    // Remove from team
    await Player.findByIdAndUpdate(playerToResell._id, {
      status: 'resold',
      soldTo: null,
      isResold: true,
    });

    team.players = team.players.filter((p) => p._id.toString() !== playerToResell._id.toString());
    team.budgetRemaining += refundAmount;
    team.budgetSpent -= refundAmount;
    await team.save();

    // Log resale
    const log = new AuctionLog({
      playerId: playerToResell._id,
      playerName: playerToResell.name,
      teamId,
      teamName: team.name,
      basePrice: playerToResell.basePrice,
      soldPrice: refundAmount,
      status: 'resold',
    });
    await log.save();

    return { player: playerToResell, team, log };
  }

  return null;
}

export async function getAuctionLogs() {
  await connectDB();
  return AuctionLog.find().sort({ createdAt: -1 });
}

export async function completeAuction() {
  await connectDB();

  const state = await AuctionState.findOne();
  if (!state) throw new Error('Auction state not found');

  state.status = 'completed';
  state.completedAt = new Date();

  return state.save();
}
