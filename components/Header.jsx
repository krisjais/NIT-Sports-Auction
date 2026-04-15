'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header({ user, onLogout }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout?.();
    router.push('/admin/login');
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          🏏 NIT AUCTION
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.username}</span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition"
              >
                Menu
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white text-gray-900 rounded shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
