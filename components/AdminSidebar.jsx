'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Players', href: '/admin/players', icon: '🏏' },
    { label: 'Teams', href: '/admin/teams', icon: '🏆' },
    { label: 'Auction', href: '/admin/auction', icon: '🔨' },
    { label: 'Summary', href: '/summary', icon: '📋' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-xl font-bold mb-8 text-orange-500">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-3 rounded transition ${
              pathname === item.href
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
