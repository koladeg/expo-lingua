import { lessons } from '@/data/lessons';
import { stopAgentSession } from '@/lib/agent-server';
import { buildAudioCallId } from '@/lib/call-id';
import { ClerkAuthError, requireClerkUserId } from '@/lib/clerk-server';

type StopAgentRequestBody = {
  lessonId?: string;
  sessionId?: string;
};

/**
 * Requests closure of the AI teacher's session. Called both when the
 * learner explicitly ends the call and when the audio lesson screen
 * unmounts — see hooks/use-agent-session.ts. Safe to call more than once
 * for the same session.
 */
export async function POST(request: Request) {
  let userId: string;

  try {
    userId = await requireClerkUserId(request);
  } catch (error) {
    if (error instanceof ClerkAuthError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    console.error('Clerk auth error while stopping the AI teacher', error);
    return Response.json({ error: 'Authentication failed' }, { status: 500 });
  }

  let body: StopAgentRequestBody;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const lesson = lessons.find((currentLesson) => currentLesson.id === body.lessonId);

  if (!lesson || !body.sessionId) {
    return Response.json({ error: 'Unknown lesson or session' }, { status: 400 });
  }

  try {
    const callId = buildAudioCallId(lesson.id, userId);
    await stopAgentSession(callId, body.sessionId);

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Failed to stop the AI teacher agent', error);
    return Response.json({ error: 'Failed to stop the AI teacher' }, { status: 502 });
  }
}
