import { verifyToken } from '@clerk/backend';

export class ClerkAuthError extends Error {}

/**
 * Verifies the Clerk session token sent as a Bearer header from the Expo app
 * and returns the authenticated user's Clerk user id.
 */
export async function requireClerkUserId(request: Request): Promise<string> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

  if (!token) {
    throw new ClerkAuthError('Missing Clerk session token');
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error('CLERK_SECRET_KEY is not configured on the server');
  }

  try {
    const payload = await verifyToken(token, { secretKey });

    if (!payload?.sub) {
      throw new ClerkAuthError('Invalid Clerk session token');
    }

    return payload.sub;
  } catch (error) {
    if (error instanceof ClerkAuthError) {
      throw error;
    }
    throw new ClerkAuthError('Invalid Clerk session token');
  }
}
