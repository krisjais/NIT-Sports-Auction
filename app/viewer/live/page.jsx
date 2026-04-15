'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';
import axios from 'axios';

export default function ViewerLivePage() {
  const [auctionState, setAuctionState] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [stateRes, playersRes, teamsRes] = await Promise.all([
        axios.get('/api/auction?action=state'),
        axios.get('/api/players'),
        axios.get('/api/teams'),
      ]);

      setAuctionState(stateRes.data.data);
      setPlayers(playersRes.data.data || []);
      setTeams(teamsRes.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load auction data');
      setLoading(false);
    }
  };

  const currentPlayer = players[auctionState?.currentPlayerIndex];
  const currentBidderTeam =
    auctionState?.currentBidder && teams.find((t) => t._id === auctionState.currentBidder);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-black bg-opacity-50 text-white p-6 text-center">
        <h1 className="text-5xl font-bold text-orange-500 mb-2">🏏 NIT AUCTION LIVE</h1>
        <p className="text-lg">
          Status: <Badge variant="primary">{auctionState?.status || 'Loading...'}</Badge>
        </p>
      </div>

      <div className="p-8">
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <div className="text-center text-white">
            <p className="text-xl">{error}</p>
          </div>
        ) : auctionState?.status === 'not_started' ? (
          <div className="text-center text-white">
            <p className="text-2xl">🔄 Auction has not started yet</p>
          </div>
        ) : auctionState?.status === 'completed' ? (
          <div className="text-center text-white">
            <p className="text-3xl font-bold mb-4">✅ Auction Completed!</p>
            <a href="/summary" className="text-orange-400 hover:text-orange-500 text-lg">
              View Final Summary
            </a>
          </div>
        ) : currentPlayer ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Display - Current Player */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 text-white text-center py-12">
                {/* Player Image Placeholder */}
                <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl shadow-lg">
                  🏏
                </div>

                <h2 className="text-5xl font-bold mb-2">{currentPlayer.name}</h2>
                <p className="text-xl text-gray-300 mb-6">
                  {currentPlayer.department} • {currentPlayer.category}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-900 bg-opacity-50 p-6 rounded-lg">
                    <p className="text-sm text-gray-300">Base Price</p>
                    <p className="text-4xl font-bold text-blue-400">
                      {currentPlayer.basePrice}
                    </p>
                  </div>

                  <div className="bg-orange-900 bg-opacity-50 p-6 rounded-lg">
                    <p className="text-sm text-gray-300">Current Bid</p>
                    <p className="text-4xl font-bold text-orange-400">
                      {auctionState?.currentBid || '—'}
                    </p>
                  </div>

                  <div className="bg-green-900 bg-opacity-50 p-6 rounded-lg">
                    <p className="text-sm text-gray-300">Highest Bidder</p>
                    <p className="text-2xl font-bold text-green-400">
                      {currentBidderTeam?.name || '—'}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {currentPlayer.skills?.length > 0 && (
                  <div className="mb-8">
                    <p className="text-lg font-semibold mb-3 text-gray-300">Skills</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {currentPlayer.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <Badge
                  variant={
                    currentPlayer.status === 'sold'
                      ? 'success'
                      : currentPlayer.status === 'unsold'
                        ? 'danger'
                        : 'primary'
                  }
                >
                  {currentPlayer.status.toUpperCase()}
                </Badge>
              </Card>

              {/* Animated Bidding Indicator */}
              <div className="mt-8 bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-center">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-white ml-4 text-lg">
                    {auctionState?.currentBid ? 'Bidding in progress...' : 'Waiting for bids...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - Teams Leaderboard */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 text-white">
                <h3 className="text-2xl font-bold mb-4">Teams</h3>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      className={`p-3 rounded-lg transition-all ${
                        team._id === auctionState?.currentBidder
                          ? 'bg-orange-600 ring-2 ring-orange-400'
                          : 'bg-gray-700'
                      }`}
                    >
                      <p className="font-semibold">{team.name}</p>
                      <p className="text-xs text-gray-300 mb-2">Captain: {team.captain}</p>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Budget Left:</span>
                          <span className="font-bold">{team.budgetRemaining}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Players:</span>
                          <span className="font-bold">
                            {team.players?.length || 0}/7
                          </span>
                        </div>

                        {/* Budget Bar */}
                        <div className="bg-gray-600 rounded-full h-2 mt-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${((team.budgetSpent / team.budgetTotal) * 100).toFixed(0)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center text-white">
            <p className="text-2xl">Loading player data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
