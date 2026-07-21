const AGENT_SERVICE_TIMEOUT_MS = 30_000;

export type StartAgentSessionResult = {
  sessionId: string;
  callId: string;
  sessionStartedAt: string;
};

function getAgentServiceUrl(): string {
  const url = process.env.AGENT_SERVICE_URL;

  if (!url) {
    throw new Error('AGENT_SERVICE_URL is not configured on the server');
  }

  return url.replace(/\/+$/, '');
}

function getAgentServiceHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const apiKey = process.env.AGENT_SERVICE_API_KEY;

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

async function agentServiceFetch(path: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AGENT_SERVICE_TIMEOUT_MS);

  try {
    return await fetch(`${getAgentServiceUrl()}${path}`, {
      ...init,
      headers: { ...getAgentServiceHeaders(), ...init.headers },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Server-only proxy to the Vision Agents HTTP service — see
 * vision-agent/agent.py (`serve` mode). Never call the agent service
 * directly from the mobile app: its URL and shared secret must stay
 * server-side, and it has no per-user auth of its own.
 */
export async function startAgentSession(
  callId: string,
  callType: string,
): Promise<StartAgentSessionResult> {
  const response = await agentServiceFetch(`/calls/${encodeURIComponent(callId)}/sessions`, {
    method: 'POST',
    body: JSON.stringify({ call_type: callType }),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail ?? `Vision Agent service returned ${response.status}`);
  }

  const data = await response.json();

  return {
    sessionId: data.session_id,
    callId: data.call_id,
    sessionStartedAt: data.session_started_at,
  };
}

export async function stopAgentSession(callId: string, sessionId: string): Promise<void> {
  const response = await agentServiceFetch(
    `/calls/${encodeURIComponent(callId)}/sessions/${encodeURIComponent(sessionId)}`,
    { method: 'DELETE' },
  );

  // A session that's already gone (agent left on its own, idle timeout,
  // duplicate stop from unmount + end-call both firing) isn't an error.
  if (!response.ok && response.status !== 404) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail ?? `Vision Agent service returned ${response.status}`);
  }
}
