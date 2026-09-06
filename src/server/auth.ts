import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { query } from '../db/pg';
import { User, AuthSession } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: User;
  sessionToken?: string;
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export function generateNumericOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Verify a plain text password against a bcrypt hash
 */
export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

/**
 * Issue a new session for a user and return the token and expiration
 */
export async function createSession(userId: string): Promise<AuthSession> {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = 'ses-' + crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await query(
    `INSERT INTO sessions (id, user_id, token, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [sessionId, userId, token, expiresAt.toISOString()]
  );

  const userRes = await query(
    `SELECT id, email, full_name, role, avatar_url, is_student_verified, institution_name, created_at
     FROM users WHERE id = $1`,
    [userId]
  );

  const u = userRes.rows[0];
  const user: User = {
    id: u.id,
    email: u.email,
    fullName: u.full_name,
    role: u.role,
    avatarUrl: u.avatar_url || undefined,
    isStudentVerified: Boolean(u.is_student_verified),
    institutionName: u.institution_name || undefined,
    createdAt: u.created_at,
  };

  return {
    user,
    token,
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Invalidate a session token
 */
export async function destroySession(token: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE token = $1`, [token]);
}

/**
 * Extract and validate session token from Bearer header or cookie
 */
export async function getSessionUser(token: string): Promise<User | null> {
  if (!token) return null;

  const res = await query(
    `SELECT s.expires_at, u.id, u.email, u.full_name, u.role, u.avatar_url, u.is_student_verified, u.institution_name, u.created_at
     FROM sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.token = $1`,
    [token]
  );

  if (res.rows.length === 0) return null;
  const row = res.rows[0];

  if (new Date(row.expires_at) < new Date()) {
    // Session expired
    await destroySession(token);
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    avatarUrl: row.avatar_url || undefined,
    isStudentVerified: Boolean(row.is_student_verified),
    institutionName: row.institution_name || undefined,
    createdAt: row.created_at,
  };
}

/**
 * Express middleware to optionally extract the authenticated user
 */
export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.cookies && req.cookies.dhariya_session) {
      token = req.cookies.dhariya_session;
    }

    if (token) {
      const user = await getSessionUser(token);
      if (user) {
        req.user = user;
        req.sessionToken = token;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Express middleware to strictly require an authenticated user
 */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  await optionalAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please sign in with your student or registered email.',
        },
      });
    }
    next();
  });
}

/**
 * Express middleware to enforce Role-Based Access Control (RBAC)
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`,
        },
      });
    }

    next();
  };
}
