import { verifyToken } from '@/lib/utils/jwt';

export function withAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No authentication token provided',
        });
      }

      const payload = verifyToken(token);

      if (!payload) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
        });
      }

      req.user = payload;
      return handler(req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: error.message,
      });
    }
  };
}

export function withAdminAuth(handler) {
  return withAuth(async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    return handler(req, res);
  });
}
