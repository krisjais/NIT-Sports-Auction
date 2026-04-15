import { useState, useCallback } from 'react';
import axios from 'axios';

export function useAPI(baseURL = process.env.NEXT_PUBLIC_API_URL) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (endpoint, method = 'GET', data = null, token = null) => {
      setLoading(true);
      setError(null);

      try {
        const config = {
          url: `${baseURL}${endpoint}`,
          method,
          headers: {
            'Content-Type': 'application/json',
          },
        };

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (data && (method === 'POST' || method === 'PUT')) {
          config.data = data;
        }

        const response = await axios(config);
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  return { request, loading, error };
}

export function useAuth() {
  const { request, loading, error } = useAPI();

  const login = useCallback(
    async (username, password) => {
      return request('/api/auth', 'POST', {
        action: 'login',
        username,
        password,
      });
    },
    [request]
  );

  const register = useCallback(
    async (username, password) => {
      return request('/api/auth', 'POST', {
        action: 'register',
        username,
        password,
      });
    },
    [request]
  );

  return { login, register, loading, error };
}
