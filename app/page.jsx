'use client';

import Link from 'next/link';
import Button from '@/components/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <nav className="bg-black bg-opacity-50 backdrop-blur-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">🏏 NIT AUCTION</h1>
          <div className="flex gap-4">
            <Link href="/admin/login">
              <Button variant="primary" size="sm">
                Admin Login
              </Button>
            </Link>
            <Link href="/viewer/live">
              <Button variant="secondary" size="sm">
                View Live
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center text-white px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-8xl mb-6">🏏</div>
          <h1 className="text-6xl font-bold mb-4">NIT Sports Auction</h1>
          <p className="text-xl text-gray-300 mb-8">
            Professional Cricket Auction Platform for Team Management & Live Bidding
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-orange-500 border-opacity-30">
              <p className="text-4xl mb-2">8</p>
              <p className="text-gray-300">Teams</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-blue-500 border-opacity-30">
              <p className="text-4xl mb-2">56</p>
              <p className="text-gray-300">Players</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-green-500 border-opacity-30">
              <p className="text-4xl mb-2">1000</p>
              <p className="text-gray-300">Points Budget</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/admin/login" className="flex-1 md:flex-initial">
              <Button variant="primary" size="lg" className="w-full md:w-auto">
                Admin Dashboard
              </Button>
            </Link>
            <Link href="/viewer/live" className="flex-1 md:flex-initial">
              <Button variant="secondary" size="lg" className="w-full md:w-auto">
                View Live Auction
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-gray-950 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-2xl mb-2">📊</p>
              <h3 className="text-xl font-bold text-white mb-2">Player Management</h3>
              <p className="text-gray-400">
                Add, edit, and manage players with skills, categories, and base prices
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-2xl mb-2">🏆</p>
              <h3 className="text-xl font-bold text-white mb-2">Team Management</h3>
              <p className="text-gray-400">
                Create teams, assign captains, and track budget utilization
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-2xl mb-2">🔨</p>
              <h3 className="text-xl font-bold text-white mb-2">Live Auction</h3>
              <p className="text-gray-400">
                Real-time bidding with automatic budget deduction and player assignment
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-2xl mb-2">📡</p>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Updates</h3>
              <p className="text-gray-400">
                Socket.IO integration for instant updates across all connected clients
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-2xl mb-2">♻️</p>
              <h3 className="text-xl font-bold text-white mb-2">Smart Resale</h3>
              <p className="text-gray-400">
                Automatic resale of highest-priced players when teams run out of budget
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-2xl mb-2">📋</p>
              <h3 className="text-xl font-bold text-white mb-2">Summary Reports</h3>
              <p className="text-gray-400">
                Comprehensive auction logs and final team composition reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auction Rules Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Auction Rules</h2>

          <div className="bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-30 rounded-lg p-8 text-white">
            <ul className="space-y-4 text-lg">
              <li className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold mb-1">8 Teams</p>
                  <p className="text-gray-300">Compete in the auction</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold mb-1">56 Players</p>
                  <p className="text-gray-300">7 players per team</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold mb-1">1000 Points Budget</p>
                  <p className="text-gray-300">Per team</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold mb-1">Base Price: 50 Points</p>
                  <p className="text-gray-300">Minimum starting bid</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold mb-1">Bid Increment: 10 Points</p>
                  <p className="text-gray-300">Each bid must increase by at least 10</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 text-center text-gray-400">
        <p>© 2025 NIT Sports Auction. All rights reserved.</p>
      </footer>
    </div>
  );
}
