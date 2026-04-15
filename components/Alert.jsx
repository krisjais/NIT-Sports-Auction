'use client';

import { useState, useEffect } from 'react';

export default function Alert({ message, type = 'info', onClose, autoClose = true }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-100 border-green-400 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-800',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    info: 'bg-blue-100 border-blue-400 text-blue-800',
  };

  return (
    <div className={`border-l-4 p-4 ${typeStyles[type]} rounded`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}
