'use client';

export default function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${hover ? 'hover:shadow-lg transition-shadow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
