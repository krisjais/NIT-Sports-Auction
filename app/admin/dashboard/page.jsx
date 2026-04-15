'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import Header from '@/components/Header';
import Card from '@/components/Card';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';
import axios from 'axios';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ players: 0, teams: 0, logs: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token) => {
    try {
      setLoading(true);

      const [playersRes, teamsRes, logsRes] = await Promise.all([
        axios.get('/api/players', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/teams', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/auction?action=logs', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats({
        players: playersRes.data.data?.length || 0,
        teams: teamsRes.data.data?.length || 0,
        logs: logsRes.data.data?.length || 0,
      });
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <Header user={user} onLogout={handleLogout} />

        <main className="p-8">
          {error && <Alert message={error} type="error" />}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user.username}!</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-500">{stats.players}</div>
                  <p className="text-gray-600 mt-2">Total Players</p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-500">{stats.teams}</div>
                  <p className="text-gray-600 mt-2">Total Teams</p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-500">{stats.logs}</div>
                  <p className="text-gray-600 mt-2">Auction Logs</p>
                </div>
              </Card>
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="font-semibold text-blue-900 mb-2">Getting Started</h2>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Create teams and assign captains</li>
              <li>✓ Add players with skills and base prices</li>
              <li>✓ Start the auction and manage bidding</li>
              <li>✓ View live auction on viewer dashboard</li>
              <li>✓ Review summary after auction completion</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
