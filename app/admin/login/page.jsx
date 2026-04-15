'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAPI';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Alert from '@/components/Alert';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [alerts, setAlerts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setAlerts([{ id: 1, message: 'Username and password are required', type: 'error' }]);
      return;
    }

    try {
      const response = await login(formData.username, formData.password);

      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setAlerts([{ id: 2, message: 'Login successful!', type: 'success' }]);
        setTimeout(() => router.push('/admin/dashboard'), 1000);
      }
    } catch (err) {
      setAlerts([{ id: 3, message: error || 'Login failed', type: 'error' }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-500 mb-2">🏏</h1>
            <h2 className="text-2xl font-bold text-gray-900">NIT Auction</h2>
            <p className="text-gray-600 mt-2">Admin Login</p>
          </div>

          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              message={alert.message}
              type={alert.type}
              onClose={() => setAlerts([])}
            />
          ))}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Default credentials: admin / admin_secure_password_123
          </p>
        </div>
      </div>
    </div>
  );
}
