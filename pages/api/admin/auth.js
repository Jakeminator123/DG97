/**
 * Admin API Routes
 *
 * Admin authentication and session management
 * Simple JWT-based auth (in production, use proper auth library)
 */

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Verify existing token
    const isAuthenticated = verifyAdminToken(req);

    // Return 200 with authenticated status (not 401)
    // Client will handle showing login form based on this
    return res.status(200).json({ authenticated: isAuthenticated });
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Simple admin credentials (in production, use database + bcrypt)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

    if (
      process.env.NODE_ENV === 'production' &&
      (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD)
    ) {
      return res.status(503).json({
        success: false,
        error: 'Admin credentials are not configured',
      });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create simple session token (in production, use proper JWT)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

      // Set cookie
      const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
      res.setHeader(
        'Set-Cookie',
        `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${secureFlag}`
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  if (req.method === 'DELETE') {
    // Logout
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader(
      'Set-Cookie',
      `admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secureFlag}`
    );
    return res.status(200).json({ success: true, message: 'Logged out' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Verify admin token from request
 */
export function verifyAdminToken(req) {
  const cookieHeader = req.headers.cookie || '';
  const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);

  if (!tokenMatch) {
    return false;
  }

  // Simple verification (in production, use proper JWT verification)
  try {
    const decoded = Buffer.from(tokenMatch[1], 'base64').toString();
    const [username] = decoded.split(':');

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    return username === ADMIN_USERNAME;
  } catch {
    return false;
  }
}

