import Player from '@/lib/models/Player';
import { connectDB } from '@/lib/db/connection';

export async function createPlayer(playerData) {
  await connectDB();
  const player = new Player(playerData);
  return player.save();
}

export async function getPlayers(filters = {}) {
  await connectDB();
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.department) {
    query.department = filters.department;
  }

  return Player.find(query).sort({ createdAt: -1 });
}

export async function getPlayerById(playerId) {
  await connectDB();
  return Player.findById(playerId);
}

export async function updatePlayer(playerId, updateData) {
  await connectDB();
  return Player.findByIdAndUpdate(playerId, updateData, { new: true });
}

export async function deletePlayer(playerId) {
  await connectDB();
  return Player.findByIdAndDelete(playerId);
}

export async function getAvailablePlayers() {
  await connectDB();
  return Player.find({ status: 'available' }).sort({ basePrice: 1 });
}
