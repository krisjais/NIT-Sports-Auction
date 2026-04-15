import Team from '@/lib/models/Team';
import { connectDB } from '@/lib/db/connection';

export async function createTeam(teamData) {
  await connectDB();
  const team = new Team({
    ...teamData,
    budgetRemaining: teamData.budgetTotal || 1000,
  });
  return team.save();
}

export async function getTeams() {
  await connectDB();
  return Team.find().populate('players').sort({ createdAt: 1 });
}

export async function getTeamById(teamId) {
  await connectDB();
  return Team.findById(teamId).populate('players');
}

export async function updateTeam(teamId, updateData) {
  await connectDB();
  return Team.findByIdAndUpdate(teamId, updateData, { new: true }).populate('players');
}

export async function deleteTeam(teamId) {
  await connectDB();
  return Team.findByIdAndDelete(teamId);
}

export async function addPlayerToTeam(teamId, playerId, soldPrice) {
  await connectDB();

  const team = await Team.findById(teamId);
  if (!team) throw new Error('Team not found');

  if (team.players.length >= 7) {
    throw new Error('Team already has 7 players');
  }

  if (team.budgetRemaining < soldPrice) {
    throw new Error('Insufficient budget');
  }

  team.players.push(playerId);
  team.budgetRemaining -= soldPrice;
  team.budgetSpent += soldPrice;

  return team.save();
}

export async function removePlayerFromTeam(teamId, playerId, soldPrice) {
  await connectDB();

  const team = await Team.findById(teamId);
  if (!team) throw new Error('Team not found');

  team.players = team.players.filter((id) => id.toString() !== playerId.toString());
  team.budgetRemaining += soldPrice;
  team.budgetSpent -= soldPrice;

  return team.save();
}
