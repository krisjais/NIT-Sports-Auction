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

export default function PlayersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    category: '',
    basePrice: 50,
    skills: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchPlayers(token);
  }, [router]);

  const fetchPlayers = async (token) => {
    try {
      setLoading(true);
      const res = await axios.get('/api/players', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlayers(res.data.data || []);
    } catch (err) {
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (player = null) => {
    if (player) {
      setEditingId(player._id);
      setFormData({
        name: player.name,
        department: player.department,
        category: player.category,
        basePrice: player.basePrice,
        skills: player.skills?.join(', ') || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', department: '', category: '', basePrice: 50, skills: '' });
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
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);

      const data = { ...formData, skills: skillsArray };

      if (editingId) {
        data.id = editingId;
        await axios.put('/api/players', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setError(null);
        setFormData({ name: '', department: '', category: '', basePrice: 50, skills: '' });
      } else {
        await axios.post('/api/players', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      handleCloseModal();
      fetchPlayers(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save player');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`/api/players?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPlayers(token);
    } catch (err) {
      setError('Failed to delete player');
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
              <h1 className="text-3xl font-bold text-gray-900">Players Management</h1>
              <p className="text-gray-600 mt-2">Manage all players for the auction</p>
            </div>
            <Button onClick={() => handleOpenModal()} variant="primary">
              + Add Player
            </Button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : players.length === 0 ? (
            <EmptyState message="No players found. Create one to get started!" icon="🏏" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player) => (
                <Card key={player._id} hover>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
                    <Badge variant="primary" size="sm">
                      {player.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{player.department} - {player.category}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">Base Price:</span> {player.basePrice}
                    </p>
                    {player.skills?.length > 0 && (
                      <p className="text-sm">
                        <span className="font-semibold">Skills:</span> {player.skills.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => handleOpenModal(player)}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(player._id)}
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'Edit Player' : 'Add Player'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Player Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., John Doe"
            required
          />

          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., CSE"
            required
          />

          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Batsman"
            required
          />

          <Input
            label="Base Price"
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            min="50"
            required
          />

          <Input
            label="Skills (comma-separated)"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., Batting, Fielding, Leadership"
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
