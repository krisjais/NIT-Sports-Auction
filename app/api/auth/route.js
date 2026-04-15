import { authenticateUser, createUser } from '@/lib/services/userService';
import { generateToken } from '@/lib/utils/jwt';
import { validateUsername, validatePassword } from '@/lib/utils/validation';
import { connectDB } from '@/lib/db/connection';

export async function POST(req) {
  try {
    await connectDB();

    const { action, username, password } = await req.json();

    if (!action) {
      return Response.json(
        { success: false, message: 'Action is required' },
        { status: 400 }
      );
    }

    if (action === 'login') {
      if (!validateUsername(username) || !validatePassword(password)) {
        return Response.json(
          { success: false, message: 'Invalid username or password format' },
          { status: 400 }
        );
      }

      const user = await authenticateUser(username, password);
      const token = generateToken(user._id, user.username, user.role);

      return Response.json(
        {
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: user._id,
              username: user.username,
              role: user.role,
            },
          },
        },
        { status: 200 }
      );
    }

    if (action === 'register') {
      if (!validateUsername(username) || !validatePassword(password)) {
        return Response.json(
          { success: false, message: 'Invalid username or password format' },
          { status: 400 }
        );
      }

      const user = await createUser(username, password, 'admin');

      return Response.json(
        {
          success: true,
          message: 'Registration successful',
          data: {
            user: {
              id: user._id,
              username: user.username,
              role: user.role,
            },
          },
        },
        { status: 201 }
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
        message: error.message || 'Authentication error',
      },
      { status: 500 }
    );
  }
}
