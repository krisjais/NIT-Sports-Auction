'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import axios from 'axios';
import { formatDate } from '@/lib/utils/formatters';

export default function SummaryPage() {
  const [teams, setTeams] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [teamsRes, logsRes] = await Promise.all([
        axios.get('/api/teams'),
        axios.get('/api/auction?action=logs'),
      ]);

      setTeams(teamsRes.data.data || []);
      setLogs(logsRes.data.data || []);
    } catch (err) {
      setError('Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">🏏 Auction Summary</h1>
          <p className="text-lg">Final Results & Team Statistics</p>
          <button
            onClick={handlePrint}
            className="mt-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded text-white font-semibold transition"
          >
            🖨️ Print Summary
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Card className="text-center p-8">
            <p className="text-red-600 text-lg">{error}</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Teams Summary */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Final Team Standings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map((team) => (
                  <Card key={team._id} hover>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-600">Captain: {team.captain}</p>
                    </div>

                    <div className="space-y-3 mb-4 p-3 bg-gray-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Total Budget:</span>
                        <span className="font-bold text-lg">{team.budgetTotal}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Budget Spent:</span>
                        <Badge variant="warning">{team.budgetSpent}</Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Budget Remaining:</span>
                        <Badge variant="success">{team.budgetRemaining}</Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Players Acquired:</span>
                        <Badge variant="primary">{team.players?.length || 0}/7</Badge>
                      </div>
                    </div>

                    {/* Budget Utilization */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-1">Budget Utilization</p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-orange-500 h-3 rounded-full"
                          style={{
                            width: `${((team.budgetSpent / team.budgetTotal) * 100).toFixed(0)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {((team.budgetSpent / team.budgetTotal) * 100).toFixed(1)}% utilized
                      </p>
                    </div>

                    {/* Players List */}
                    {team.players?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Squad Composition</p>
                        <div className="space-y-1">
                          {team.players.map((player, idx) => (
                            <div key={player._id} className="text-xs text-gray-600">
                              {idx + 1}. {player.name}{' '}
                              <span className="font-semibold">({player.soldPrice} pts)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>

            {/* Auction Logs */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Auction Logs</h2>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Player</th>
                        <th className="text-left p-3 font-semibold">Team</th>
                        <th className="text-left p-3 font-semibold">Base Price</th>
                        <th className="text-left p-3 font-semibold">Sold Price</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log._id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-semibold">{log.playerName}</td>
                          <td className="p-3">{log.teamName || '—'}</td>
                          <td className="p-3 text-blue-600">{log.basePrice || '—'}</td>
                          <td className="p-3 font-bold text-orange-600">
                            {log.soldPrice || '—'}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                log.status === 'sold'
                                  ? 'success'
                                  : log.status === 'unsold'
                                    ? 'danger'
                                    : 'warning'
                              }
                            >
                              {log.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-3 text-xs text-gray-600">
                            {formatDate(log.soldAt || log.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            {/* Statistics */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Auction Statistics</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Total Sales</p>
                    <p className="text-3xl font-bold text-orange-500">
                      {logs.filter((l) => l.status === 'sold').length}
                    </p>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Total Unsold</p>
                    <p className="text-3xl font-bold text-red-500">
                      {logs.filter((l) => l.status === 'unsold').length}
                    </p>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Total Resold</p>
                    <p className="text-3xl font-bold text-blue-500">
                      {logs.filter((l) => l.status === 'resold').length}
                    </p>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Avg Sold Price</p>
                    <p className="text-3xl font-bold text-green-500">
                      {logs.filter((l) => l.status === 'sold' && l.soldPrice).length > 0
                        ? Math.round(
                            logs
                              .filter((l) => l.status === 'sold' && l.soldPrice)
                              .reduce((sum, l) => sum + l.soldPrice, 0) /
                              logs.filter((l) => l.status === 'sold' && l.soldPrice).length
                          )
                        : 0}
                    </p>
                  </div>
                </Card>
              </div>
            </section>

            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm">
                Generated on {formatDate(new Date())}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
