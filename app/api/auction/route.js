import {
  getAuctionState,
  initializeAuctionState,
  startAuction,
  placeBid,
  sellPlayer,
  markPlayerUnsold,
  handleResale,
  getAuctionLogs,
  completeAuction,
} from '@/lib/services/auctionService';
import { verifyToken } from '@/lib/utils/jwt';

function getAuthToken(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  return token ? verifyToken(token) : null;
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'state') {
      const state = await getAuctionState();
      return Response.json(
        {
          success: true,
          data: state,
        },
        { status: 200 }
      );
    }

    if (action === 'logs') {
      const logs = await getAuctionLogs();
      return Response.json(
        {
          success: true,
          data: logs,
        },
        { status: 200 }
      );
    }

    return Response.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = getAuthToken(req);
    if (!user || user.role !== 'admin') {
      return Response.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { action, teamId, playerId, bidAmount, soldPrice } = await req.json();

    if (action === 'initialize') {
      const state = await initializeAuctionState();
      return Response.json(
        {
          success: true,
          message: 'Auction state initialized',
          data: state,
        },
        { status: 200 }
      );
    }

    if (action === 'start') {
      const state = await startAuction();
      return Response.json(
        {
          success: true,
          message: 'Auction started',
          data: state,
        },
        { status: 200 }
      );
    }

    if (action === 'bid') {
      const state = await placeBid(teamId, bidAmount);
      return Response.json(
        {
          success: true,
          message: 'Bid placed',
          data: state,
        },
        { status: 200 }
      );
    }

    if (action === 'sell') {
      const result = await sellPlayer(teamId, playerId, soldPrice);
      return Response.json(
        {
          success: true,
          message: 'Player sold',
          data: result,
        },
        { status: 200 }
      );
    }

    if (action === 'unsold') {
      const result = await markPlayerUnsold(playerId);
      return Response.json(
        {
          success: true,
          message: 'Player marked unsold',
          data: result,
        },
        { status: 200 }
      );
    }

    if (action === 'resale') {
      const result = await handleResale(teamId);
      return Response.json(
        {
          success: true,
          message: result ? 'Player resold' : 'No resale needed',
          data: result,
        },
        { status: 200 }
      );
    }

    if (action === 'complete') {
      const state = await completeAuction();
      return Response.json(
        {
          success: true,
          message: 'Auction completed',
          data: state,
        },
        { status: 200 }
      );
    }

    return Response.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
