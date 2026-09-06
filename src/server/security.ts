import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { query } from '../db/pg';
import { AuthenticatedRequest } from './auth';

/**
 * Apply hardened HTTP Security Headers
 */
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
}

/**
 * In-memory sliding rate limiter to protect endpoints from abuse
 */
interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitBucket>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore.entries()) {
    if (bucket.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimiter(options: {
  windowMs: number;
  max: number;
  message: string;
  keyPrefix?: string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `${options.keyPrefix || 'gen'}:${ip}`;
    const now = Date.now();

    const bucket = rateLimitStore.get(key);

    if (!bucket || bucket.resetTime < now) {
      rateLimitStore.set(key, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    if (bucket.count >= options.max) {
      const retryAfter = Math.ceil((bucket.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: options.message,
          retryAfterSeconds: retryAfter,
        },
      });
    }

    bucket.count += 1;
    next();
  };
}

/**
 * Sanitize string inputs to prevent Stored & Reflected XSS
 */
export function sanitizeInput(value: string): string {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .trim();
}

/**
 * Deep sanitization for request bodies
 */
export function sanitizeBody(body: any): any {
  if (typeof body === 'string') {
    return sanitizeInput(body);
  }
  if (Array.isArray(body)) {
    return body.map(sanitizeBody);
  }
  if (body && typeof body === 'object') {
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(body)) {
      clean[k] = sanitizeBody(v);
    }
    return clean;
  }
  return body;
}

/**
 * Request body sanitization middleware
 */
export function sanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    req.body = sanitizeBody(req.body);
  }
  next();
}

/**
 * Record an action to the persistent PostgreSQL audit_logs table
 */
export async function logAudit(options: {
  actorId?: string;
  actorEmail?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  req?: Request;
}) {
  try {
    const id = 'log-' + crypto.randomUUID();
    const ip = options.req ? (options.req.ip || options.req.socket.remoteAddress || null) : null;
    const ua = options.req ? options.req.headers['user-agent'] || null : null;

    await query(
      `INSERT INTO audit_logs (id, actor_id, actor_email, action, entity, entity_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        id,
        options.actorId || null,
        options.actorEmail || null,
        options.action,
        options.entity,
        options.entityId || null,
        JSON.stringify(options.details || {}),
        ip,
        ua,
      ]
    );
  } catch (err: any) {
    console.error('Failed to write audit log:', err.message);
  }
}

/**
 * Centralized, safe error handler that never leaks credentials, database internal traces, or SQL syntax
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[DHARIYA API ERROR]', err);

  const status = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message =
    status === 500
      ? 'An unexpected error occurred while processing your request. Please try again.'
      : err.message || 'Request failed';

  res.status(status).json({
    error: {
      code,
      message,
      ...(err.fields ? { fields: err.fields } : {}),
    },
  });
}
