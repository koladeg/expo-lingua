/**
 * Stream user id the AI teacher joins calls as — see
 * vision-agent/agent.py (`User(name="AI Teacher", id="ai-teacher")`). Kept
 * in sync by hand since the two live in different languages/runtimes.
 */
export const AI_TEACHER_USER_ID = 'ai-teacher';

export type AgentSessionInfo = {
  sessionId: string;
  callId: string;
  sessionStartedAt: string;
};

type GetTokenFn = () => Promise<string | null>;

async function withClerkAuth(getToken: GetTokenFn): Promise<HeadersInit> {
  const sessionToken = await getToken();

  if (!sessionToken) {
    throw new Error('You need to be signed in to use the AI teacher.');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionToken}`,
  };
}

/**
 * Asks the Expo API route to start the AI teacher agent on this lesson's
 * call. The route derives the call id server-side and the agent reads
 * lesson/language data from the call's custom data — this call only needs
 * the lesson id.
 */
export async function requestAgentSessionStart({
  getToken,
  lessonId,
}: {
  getToken: GetTokenFn;
  lessonId: string;
}): Promise<AgentSessionInfo> {
  const response = await fetch('/api/agent/start', {
    method: 'POST',
    headers: await withClerkAuth(getToken),
    body: JSON.stringify({ lessonId }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Could not start the AI teacher.');
  }

  return response.json();
}

export async function requestAgentSessionStop({
  getToken,
  lessonId,
  sessionId,
}: {
  getToken: GetTokenFn;
  lessonId: string;
  sessionId: string;
}): Promise<void> {
  const response = await fetch('/api/agent/stop', {
    method: 'POST',
    headers: await withClerkAuth(getToken),
    body: JSON.stringify({ lessonId, sessionId }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Could not stop the AI teacher.');
  }
}
