import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketIO = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketIO.on('connect', () => {
      setIsConnected(true);
    });

    socketIO.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketIO);

    return () => {
      socketIO.disconnect();
    };
  }, []);

  return { socket, isConnected };
}

export function useAuctionSocket(room) {
  const { socket, isConnected } = useSocket();
  const [auctionState, setAuctionState] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('join-auction', { role: 'viewer' });

    socket.on('state-updated', (data) => {
      setAuctionState(data);
    });

    socket.on('bid-placed', (data) => {
      setCurrentBid(data.bidAmount);
    });

    socket.on('player-sold', (data) => {
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: `${data.playerName} sold to ${data.teamName} for ${data.soldPrice}`,
          type: 'success',
        },
      ]);
    });

    return () => {
      socket.off('state-updated');
      socket.off('bid-placed');
      socket.off('player-sold');
    };
  }, [socket, isConnected]);

  return { auctionState, currentBid, notifications, socket };
}
