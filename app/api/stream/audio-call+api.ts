import { languages } from '@/data/languages';
import { lessons } from '@/data/lessons';
import { AUDIO_CALL_TYPE, buildAudioCallId } from '@/lib/call-id';
import { ClerkAuthError, requireClerkUserId } from '@/lib/clerk-server';
import { getStreamApiKey, getStreamServerClient } from '@/lib/stream-server';

/**
 * The built-in "audio_room" call type keeps the call in the "backstage"
 * state and only lets speaker/host/admin roles publish audio — see
 * hooks/use-agent-session.ts and vision-agent/agent.py, which grant the AI
 * teacher the "admin" role and call goLive() before it joins. The learner
 * is made a "host" member below so their own mic keeps working exactly like
 * it did on the "default" call type.
 */
const CALL_TYPE = AUDIO_CALL_TYPE;
const TOKEN_VALIDITY_SECONDS = 60 * 60;
const STREAM_TIMEOUT_RETRY_COUNT = 1;

type AudioCallRequestBody = {
  lessonId?: string;
  languageId?: string;
  displayName?: string;
  imageUrl?: string;
};

const TRANSIENT_NETWORK_ERROR_CODES = new Set([
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_HEADERS_TIMEOUT',
  'UND_ERR_BODY_TIMEOUT',
  'UND_ERR_SOCKET',
  'ETIMEDOUT',
  'ECONNRESET',
  'ECONNREFUSED',
  'EAI_AGAIN',
  'ENOTFOUND',
]);

/**
 * Stream's SDK wraps the real network failure (e.g. a Wi-Fi/DNS blip hitting
 * ConnectTimeoutError) inside error.code/error.cause instead of surfacing it
 * in the top-level message, so a plain message.includes('timeout') check
 * never matches. Walk the cause chain so transient connect failures retry.
 */
function isStreamTimeout(error: unknown, depth = 0): boolean {
  if (!error || depth > 5) {
    return false;
  }

  if (error instanceof Error && error.message.toLowerCase().includes('timeout')) {
    return true;
  }

  const code = (error as { code?: unknown }).code;
  if (typeof code === 'string' && TRANSIENT_NETWORK_ERROR_CODES.has(code)) {
    return true;
  }

  const nested = (error as { cause?: unknown }).cause;
  return isStreamTimeout(nested, depth + 1);
}

async function runStreamRequest<T>(request: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt <= STREAM_TIMEOUT_RETRY_COUNT; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      if (!isStreamTimeout(error) || attempt === STREAM_TIMEOUT_RETRY_COUNT) {
        throw error;
      }
    }
  }

  throw new Error('Stream request retry failed');
}

export async function POST(request: Request) {
  let userId: string;

  try {
    userId = await requireClerkUserId(request);
  } catch (error) {
    if (error instanceof ClerkAuthError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    console.error('Clerk auth error while starting audio call', error);
    return Response.json({ error: 'Authentication failed' }, { status: 500 });
  }

  let body: AudioCallRequestBody;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { lessonId, languageId, displayName, imageUrl } = body;

  const lesson = lessons.find((currentLesson) => currentLesson.id === lessonId);
  const language = languages.find((currentLanguage) => currentLanguage.id === languageId);

  if (!lesson || !language || lesson.languageId !== language.id) {
    return Response.json({ error: 'Unknown lesson or language' }, { status: 400 });
  }

  try {
    const client = getStreamServerClient();

    await runStreamRequest(() =>
      client.upsertUsers([
        {
          id: userId,
          name: displayName || 'Learner',
          image: imageUrl,
          role: 'user',
        },
      ]),
    );

    const callId = buildAudioCallId(lesson.id, userId);
    const call = client.video.call(CALL_TYPE, callId);

    await runStreamRequest(() =>
      call.getOrCreate({
        data: {
          created_by_id: userId,
          members: [{ user_id: userId, role: 'host' }],
          custom: {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            lessonDescription: lesson.description,
            languageId: language.id,
            languageName: language.name,
            mode: 'audio',
            goals: lesson.goals,
            vocabulary: lesson.vocabulary,
            phrases: lesson.phrases,
            aiTeacherPrompt: lesson.aiTeacherPrompt,
          },
          settings_override: {
            audio: {
              default_device: 'speaker',
              mic_default_on: true,
              speaker_default_on: true,
            },
          },
        },
      }),
    );

    const token = client.generateUserToken({
      user_id: userId,
      validity_in_seconds: TOKEN_VALIDITY_SECONDS,
    });

    return Response.json({
      apiKey: getStreamApiKey(),
      token,
      userId,
      callId,
      callType: CALL_TYPE,
    });
  } catch (error) {
    console.error('Failed to create Stream audio call', error);

    if (isStreamTimeout(error)) {
      return Response.json(
        { error: 'Stream took too long to respond. Check your connection and try again.' },
        { status: 504 },
      );
    }

    return Response.json({ error: 'Failed to start the audio lesson call' }, { status: 500 });
  }
}
