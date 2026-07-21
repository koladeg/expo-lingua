import { StreamClient } from '@stream-io/node-sdk';

let cachedClient: StreamClient | null = null;
const STREAM_REQUEST_TIMEOUT_MS = 30_000;

export function getStreamApiKey(): string {
  const apiKey = process.env.STREAM_API_KEY;

  if (!apiKey) {
    throw new Error('STREAM_API_KEY is not configured on the server');
  }

  return apiKey;
}

/**
 * Server-only Stream client, built from STREAM_API_KEY/STREAM_API_SECRET.
 * Never import this file from client code — the secret must stay server-side.
 */
export function getStreamServerClient(): StreamClient {
  if (cachedClient) {
    return cachedClient;
  }

  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiSecret) {
    throw new Error('STREAM_API_SECRET is not configured on the server');
  }

  cachedClient = new StreamClient(getStreamApiKey(), apiSecret, {
    timeout: STREAM_REQUEST_TIMEOUT_MS,
  });
  return cachedClient;
}
