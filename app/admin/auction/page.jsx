'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import axios from 'axios';

export default function AuctionPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [auctionState, setAuctionState] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [bidData, setBidData] = useState({ teamId: '', bidAmount: 0 });
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [sellData, setSellData] = useState({ teamId: '', soldPrice: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    setUser(JSON.parse(userData));
    initializeAuction(token);
  }, [router]);

  const initializeAuction = async (token) => {
    try {
      setLoading(true);

      await axios.post(
        '/api/auction',
        { action: 'initialize' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAuctionState(token);
      fetchData(token);
    } catch (err) {
      setError('Failed to initialize auction');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuctionState = async (token) => {
    try {
      const res = await axios.get('/api/auction?action=state', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuctionState(res.data.data);
    } catch (err) {
      setError('Failed to fetch auction state');
    }
  };

  const fetchData = async (token) => {
    try {
      const [playersRes, teamsRes] = await Promise.all([
        axios.get('/api/players', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/teams', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setPlayers(playersRes.data.data || []);
      setTeams(teamsRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  const handleStartAuction = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        '/api/auction',
        { action: 'start' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAuctionState(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start auction');
    }
  };

  const handlePlaceBid = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        '/api/auction',
        {
          action: 'bid',
          teamId: bidData.teamId,
          bidAmount: parseInt(bidData.bidAmount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBidModalOpen(false);
      setBidData({ teamId: '', bidAmount: 0 });
      fetchAuctionState(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
    }
  };

  const handleSellPlayer = async () => {
    const token = localStorage.getItem('token');
    const currentPlayer = players[auctionState?.currentPlayerIndex];

    try {
      await axios.post(
        '/api/auction',
        {
          action: 'sell',
          teamId: sellData.teamId,
          playerId: currentPlayer._id,
          soldPrice: parseInt(sellData.soldPrice),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSellModalOpen(false);
      setSellData({ teamId: '', soldPrice: 0 });
      fetchAuctionState(token);
      fetchData(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sell player');
    }
  };

  const handleMarkUnsold = async () => {
    const token = localStorage.getItem('token');
    const currentPlayer = players[auctionState?.currentPlayerIndex];

    try {
      await axios.post(
        '/api/auction',
        { action: 'unsold', playerId: currentPlayer._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAuctionState(token);
      fetchData(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark player as unsold');
    }
  };

  const handleCompleteAuction = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        '/api/auction',
        { action: 'complete' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAuctionState(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete auction');
    }
  };

  const handleLogout = () => {
    setUser(null);
    router.push('/admin/login');
  };

  if (!user) {
    return null;
  }

  const currentPlayer = players[auctionState?.currentPlayerIndex];
  const currentBidderTeam =
    auctionState?.currentBidder && teams.find((t) => t._id === auctionState.currentBidder);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <Header user={user} onLogout={handleLogout} />

        <main className="p-8">
          {error && <Alert message={error} type="error" />}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Live Auction</h1>
            <p className="text-gray-600 mt-2">
              Status: <Badge variant="primary">{auctionState?.status}</Badge>
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Player Card */}
              {currentPlayer && (
                <div className="lg:col-span-2">
                  <Card>
                    <div className="text-center py-8">
                      <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        {currentPlayer.name}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {currentPlayer.department} • {currentPlayer.category}
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded">
                          <p className="text-sm text-gray-600">Base Price</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {currentPlayer.basePrice}
                          </p>
                        </div>

                        <div className="bg-orange-50 p-4 rounded">
                          <p className="text-sm text-gray-600">Current Bid</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {auctionState?.currentBid || 'No bid'}
                          </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded">
                          <p className="text-sm text-gray-600">Highest Bidder</p>
                          <p className="text-lg font-bold text-green-600">
                            {currentBidderTeam?.name || '—'}
                          </p>
                        </div>
                      </div>

                      {currentPlayer.skills?.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm text-gray-600 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {currentPlayer.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => setBidModalOpen(true)}
                          variant="primary"
                          size="lg"
                        >
                          Place Bid
                        </Button>

                        <Button
                          onClick={() => setSellModalOpen(true)}
                          variant="secondary"
                          size="lg"
                        >
                          Sell Player
                        </Button>

                        <Button
                          onClick={handleMarkUnsold}
                          variant="ghost"
                          size="lg"
                        >
                          Mark Unsold
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Control Panel */}
              <div>
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Auction Controls</h3>

                  <div className="space-y-2">
                    {auctionState?.status === 'not_started' && (
                      <Button
                        onClick={handleStartAuction}
                        variant="primary"
                        className="w-full"
                      >
                        Start Auction
                      </Button>
                    )}

                    {auctionState?.status === 'in_progress' && (
                      <>
                        <div className="bg-blue-50 p-3 rounded mb-2">
                          <p className="text-sm text-blue-900">
                            Player {(auctionState?.currentPlayerIndex || 0) + 1} of{' '}
                            {players.length}
                          </p>
                        </div>

                        <Button
                          onClick={handleCompleteAuction}
                          variant="danger"
                          className="w-full"
                        >
                          Complete Auction
                        </Button>
                      </>
                    )}

                    {auctionState?.status === 'completed' && (
                      <Button
                        onClick={() => router.push('/summary')}
                        variant="secondary"
                        className="w-full"
                      >
                        View Summary
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Teams Status */}
                <Card className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Teams Status</h3>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {teams.map((team) => (
                      <div key={team._id} className="p-2 bg-gray-50 rounded">
                        <p className="text-sm font-semibold">{team.name}</p>
                        <p className="text-xs text-gray-600">
                          Budget: {team.budgetRemaining}/{team.budgetTotal} | Players: {team.players?.length || 0}/7
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bid Modal */}
      <Modal isOpen={bidModalOpen} onClose={() => setBidModalOpen(false)} title="Place Bid" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Team</label>
            <select
              value={bidData.teamId}
              onChange={(e) => setBidData({ ...bidData, teamId: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select a team...</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name} (Budget: {team.budgetRemaining})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Bid Amount"
            type="number"
            value={bidData.bidAmount}
            onChange={(e) => setBidData({ ...bidData, bidAmount: e.target.value })}
            min={currentPlayer?.basePrice || 0}
          />

          <div className="flex gap-2 justify-end pt-4">
            <Button onClick={() => setBidModalOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button onClick={handlePlaceBid} variant="primary">
              Place Bid
            </Button>
          </div>
        </div>
      </Modal>

      {/* Sell Modal */}
      <Modal isOpen={sellModalOpen} onClose={() => setSellModalOpen(false)} title="Sell Player" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Selling To</label>
            <select
              value={sellData.teamId}
              onChange={(e) => setSellData({ ...sellData, teamId: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select a team...</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Sold Price"
            type="number"
            value={sellData.soldPrice}
            onChange={(e) => setSellData({ ...sellData, soldPrice: e.target.value })}
            min={currentPlayer?.basePrice || 0}
          />

          <div className="flex gap-2 justify-end pt-4">
            <Button onClick={() => setSellModalOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button onClick={handleSellPlayer} variant="primary">
              Sell Player
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
