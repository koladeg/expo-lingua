import { lessons } from '@/data/lessons';
import { startAgentSession } from '@/lib/agent-server';
import { AUDIO_CALL_TYPE, buildAudioCallId } from '@/lib/call-id';
import { ClerkAuthError, requireClerkUserId } from '@/lib/clerk-server';

type StartAgentRequestBody = {
  lessonId?: string;
};

/**
 * Asks the Vision Agent service to join the learner's audio lesson call.
 * The call id is derived server-side from the authenticated user, never
 * taken from the client, so a learner can only start an agent on their own
 * call. The agent reads lesson/language/goal data from the call's custom
 * data (set in app/api/stream/audio-call+api.ts) rather than from this
 * request body.
 */
export async function POST(request: Request) {
  let userId: string;

  try {
    userId = await requireClerkUserId(request);
  } catch (error) {
    if (error instanceof ClerkAuthError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    console.error('Clerk auth error while starting the AI teacher', error);
    return Response.json({ error: 'Authentication failed' }, { status: 500 });
  }

  let body: StartAgentRequestBody;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const lesson = lessons.find((currentLesson) => currentLesson.id === body?.lessonId);

  if (!lesson) {
    return Response.json({ error: 'Unknown lesson' }, { status: 400 });
  }

  try {
    const callId = buildAudioCallId(lesson.id, userId);
    const session = await startAgentSession(callId, AUDIO_CALL_TYPE);

    return Response.json(
      {
        sessionId: session.sessionId,
        callId: session.callId,
        sessionStartedAt: session.sessionStartedAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to start the AI teacher agent', error);
    return Response.json({ error: 'Failed to start the AI teacher' }, { status: 502 });
  }
}
