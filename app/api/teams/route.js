import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} from '@/lib/services/teamService';
import { validateTeamData } from '@/lib/utils/validation';
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
      const team = await getTeamById(id);
      return Response.json(
        {
          success: true,
          data: team,
        },
        { status: 200 }
      );
    }

    const teams = await getTeams();
    return Response.json(
      {
        success: true,
        data: teams,
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
    const errors = validateTeamData(data);

    if (errors.length > 0) {
      return Response.json(
        { success: false, message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    const team = await createTeam(data);

    return Response.json(
      {
        success: true,
        message: 'Team created successfully',
        data: team,
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
        { success: false, message: 'Team ID is required' },
        { status: 400 }
      );
    }

    const team = await updateTeam(id, data);

    return Response.json(
      {
        success: true,
        message: 'Team updated successfully',
        data: team,
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
        { success: false, message: 'Team ID is required' },
        { status: 400 }
      );
    }

    await deleteTeam(id);

    return Response.json(
      {
        success: true,
        message: 'Team deleted successfully',
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
