'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import axios from 'axios';

export default function TeamsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    captain: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchTeams(token);
  }, [router]);

  const fetchTeams = async (token) => {
    try {
      setLoading(true);
      const res = await axios.get('/api/teams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data.data || []);
    } catch (err) {
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (team = null) => {
    if (team) {
      setEditingId(team._id);
      setFormData({
        name: team.name,
        captain: team.captain,
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', captain: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const data = { ...formData };

      if (editingId) {
        data.id = editingId;
        await axios.put('/api/teams', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/teams', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      handleCloseModal();
      fetchTeams(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save team');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`/api/teams?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTeams(token);
    } catch (err) {
      setError('Failed to delete team');
    }
  };

  const handleLogout = () => {
    setUser(null);
    router.push('/admin/login');
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

          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teams Management</h1>
              <p className="text-gray-600 mt-2">Create and manage auction teams</p>
            </div>
            <Button onClick={() => handleOpenModal()} variant="primary">
              + Add Team
            </Button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : teams.length === 0 ? (
            <EmptyState message="No teams found. Create 8 teams to start!" icon="🏆" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((team) => (
                <Card key={team._id} hover>
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-600">Captain: {team.captain}</p>
                  </div>

                  <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm">
                      <span className="font-semibold">Budget Remaining:</span>{' '}
                      <Badge variant="warning">{team.budgetRemaining} pts</Badge>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Budget Spent:</span>{' '}
                      <Badge variant="success">{team.budgetSpent} pts</Badge>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Players:</span>{' '}
                      <Badge variant="primary">{team.players?.length || 0}/7</Badge>
                    </p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${((team.budgetSpent / team.budgetTotal) * 100).toFixed(0)}%`,
                      }}
                    ></div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => handleOpenModal(team)}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(team._id)}
                      variant="danger"
                      size="sm"
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'Edit Team' : 'Add Team'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Team Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Titans"
            required
          />

          <Input
            label="Captain Name"
            name="captain"
            value={formData.captain}
            onChange={handleChange}
            placeholder="e.g., John Doe"
            required
          />

          <div className="flex gap-2 justify-end pt-4">
            <Button onClick={handleCloseModal} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
