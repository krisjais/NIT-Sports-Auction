import { Server as SocketIOServer } from 'socket.io';

let io = null;

export function initializeSocket(server) {
  if (io) {
    return io;
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-auction', (data) => {
      socket.join('auction-room');
      io.to('auction-room').emit('user-joined', {
        userId: socket.id,
        role: data.role,
      });
    });

    socket.on('place-bid', (data) => {
      io.to('auction-room').emit('bid-placed', data);
    });

    socket.on('player-sold', (data) => {
      io.to('auction-room').emit('player-sold', data);
    });

    socket.on('auction-state-changed', (data) => {
      io.to('auction-room').emit('state-updated', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      io.to('auction-room').emit('user-left', { userId: socket.id });
    });
  });

  return io;
}

export function getIO() {
  return io;
}

export function emitToRoom(room, event, data) {
  if (io) {
    io.to(room).emit(event, data);
  }
}
