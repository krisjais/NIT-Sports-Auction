import { 
  createPlayer, 
  getPlayers, 
  getPlayerById, 
  updatePlayer, 
  deletePlayer 
} from '@/lib/services/playerService';
import { validatePlayerData } from '@/lib/utils/validation';
import { verifyToken } from '@/lib/utils/jwt';

function getAuthToken(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  return token ? verifyToken(token) : null;
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      const player = await getPlayerById(id);
      return Response.json(
        {
          success: true,
          data: player,
        },
        { status: 200 }
      );
    }

    const players = await getPlayers();
    return Response.json(
      {
        success: true,
        data: players,
      },
      { status: 200 }
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

    const data = await req.json();
    const errors = validatePlayerData(data);

    if (errors.length > 0) {
      return Response.json(
        { success: false, message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    const player = await createPlayer(data);

    return Response.json(
      {
        success: true,
        message: 'Player created successfully',
        data: player,
      },
      { status: 201 }
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

export async function PUT(req) {
  try {
    const user = getAuthToken(req);
    if (!user || user.role !== 'admin') {
      return Response.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { id } = data;

    if (!id) {
      return Response.json(
        { success: false, message: 'Player ID is required' },
        { status: 400 }
      );
    }

    const player = await updatePlayer(id, data);

    return Response.json(
      {
        success: true,
        message: 'Player updated successfully',
        data: player,
      },
      { status: 200 }
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

export async function DELETE(req) {
  try {
    const user = getAuthToken(req);
    if (!user || user.role !== 'admin') {
      return Response.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, message: 'Player ID is required' },
        { status: 400 }
      );
    }

    await deletePlayer(id);

    return Response.json(
      {
        success: true,
        message: 'Player deleted successfully',
      },
      { status: 200 }
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
